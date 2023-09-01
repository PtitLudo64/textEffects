const normalizeKey = k => {
    while (k.indexOf('-') > 0) {
        let car = k.indexOf('-');
        k = k.substring(0, car) + k.substring(car + 1, car + 2).toUpperCase() + k.substring(car + 2, k.length);
    }
    return (k);
};

const getCssProperty = (idList, id, arr) => {
    for (let val in idList) {
        let cssRule = (idList[val].selectorText);
        if (cssRule !== undefined) {
            if (cssRule.indexOf(id) >= 0) {
                if (cssRule[cssRule.indexOf(id) + id.length] == undefined) {
                    for (i = 0; i < idList[val].style.length; i++) {
                        let key = normalizeKey(idList[val].style[i]);
                        // debugger;
                        let v = idList[val].style[key].replaceAll('"', '\\\"');
                        arr.push(JSON.parse(`{"${key}": "${v}"}`));
                    }
                }
            }
        }
    }
};

const strRandom = (o) => {
    let a = 10,
        b = 'abcdefghijklmnopqrstuvwxyz',
        c = '',
        d = 0,
        e = '' + b;
    if (o) {
        if (o.startsWithLowerCase) {
            c = b[Math.floor(Math.random() * b.length)];
            d = 1;
        }
        if (o.length) {
            a = o.length;
        }
        if (o.includeUpperCase) {
            e += b.toUpperCase();
        }
        if (o.includeNumbers) {
            e += '1234567890';
        }
    }
    for (; d < a; d++) {
        c += e[Math.floor(Math.random() * e.length)];
    }
    return c;
};

window.onload = () => {
    const texts = document.querySelectorAll('p[data-split]');

    texts.forEach((t, idx) => {
        const bBox = t.getBoundingClientRect();
        const innerTxt = t.innerText;
        const textStyle = [];

        console.log(t.id, t.classList);

        getCssProperty(document.styleSheets[0].cssRules, t.id, textStyle);

        // attributs :
        //  del : delay in ms
        //  dur : duration in ms
        //  cut : percentage of the line Height (between [0 and 1[ )
        //  onScroll : default=false. Set to 'true' if the animation starts when scrolling, in this case the delay attribute is ignored.
        const attributs = JSON.parse(t.attributes[0].value);
        if (attributs.cut < 0 || attributs.cut >= 1) {
            attributs.cut = 0.5;
            console.warn("Invalid 'cut' parameter, set to default : 0.5");
        }

        // recherche du parent.
        const tParent = t.parentNode;
        // recherche du 'grand Frère'
        const tBrother = t.previousElementSibling;
        // console.log('Parent : ',tParent);
        // console.log('Brother : ', tBrother);

        let lineCut = attributs.cut ? attributs.cut : 0.5;

        const divHaut = document.createElement('div');

        // tParent.appendChild(divHaut);
        if (tBrother)
            tBrother.insertAdjacentElement('afterend', divHaut);
        else
            tParent.appendChild(divHaut);
        divHaut.style.position = 'absolute';
        divHaut.style.top = bBox.top + 'px';
        divHaut.style.left = bBox.left + 'px';
        divHaut.style.width = bBox.width + 'px';
        divHaut.style.height = bBox.height * lineCut + 'px';
        divHaut.style.overflowY = 'hidden';
        divHaut.id = strRandom({
            includeUpperCase: true,
            includeNumbers: true,
            length: 5,
            startsWithLowerCase: true
          });

        const divBas = document.createElement('div');
        // divBas.classList.add('divTestGreen');
        // tParent.appendChild(divBas);
        divHaut.insertAdjacentElement('afterend', divBas);
        divBas.style.position = 'absolute';
        divBas.style.top = bBox.bottom - (bBox.height * (1 - lineCut)) + 'px';
        divBas.style.left = bBox.left + 'px';
        divBas.style.width = bBox.width + 'px';
        divBas.style.height = bBox.height * (1 - lineCut) + 'px';
        divBas.style.overflowY = 'hidden';
        divBas.id = strRandom({
            includeUpperCase: true,
            includeNumbers: true,
            length: 5,
            startsWithLowerCase: true
          });


        t.style.visibility = "hidden";

        divHaut.innerHTML = `<p>${innerTxt}</p>`;
        divBas.innerHTML = `<p>${innerTxt}</p>`;

        const txtHaut = divHaut.querySelector('p');
        const txtBas = divBas.querySelector('p');

        if (t.classList) {
            t.classList.forEach(c => txtHaut.classList.add(c));
            t.classList.forEach(c => txtBas.classList.add(c));
        }
        textStyle.forEach((s) => {
            for (let elt in s) {
                txtHaut.style[elt] = `${s[elt]}`;
                txtBas.style[elt] = `${s[elt]}`;
            }
        })

        txtBas.style.transform = `translateY(-${100*lineCut}%)`;

        divHaut.style.animation = `splitToTop ${attributs.dur}ms ${attributs.del}ms forwards ease`;
        divBas.style.animation = `splitToBottom ${attributs.dur}ms ${attributs.del}ms forwards ease`;

        divHaut.addEventListener('animationend', () => {
            tParent.removeChild(divHaut);
        });
        divBas.addEventListener('animationend', () => {
            tParent.removeChild(divBas);
        });

        // TODO :
        // Checker que c'est un <p>
        // * Stocker le innerText,
        // * Stocker les styles (typo, size, spacing...)
        // * Si une class est appliquée, la mettre sur les div créées.
        // * Stocker la BoundingBox,
        // * Stocker le parent, supprimer l'élément, Créer 2 div de 50% de la hauteur l'une sous l'autre, y placer un <p> avec le innerTxt,
        // * Décaler le texte dans la div du bas de 50% vers le haut.
        // * appliquer les animations
        // * Supprimer les divs en fin d'animation
    });
}