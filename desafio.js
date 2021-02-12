// transformar romanos em decimais
/* 
I	unus	1 (um)
V	quinque	5 (cinco)
X	decem	10 (dez)
L	quinquaginta	50 (cinquenta)
C	centum	100 (cem)
D	quingenti	500 (quinhentos)
M	mille	1,000 (mil)
II
*/
const [I, V, X, L, C, D, M] = [1, 5, 10, 50, 100, 500, 1000];
let decimal = 0;
function transformar(romano) {
    let recorte = romano.split('').map(str => {
        
        switch (str.toUpperCase()) {
            case 'I': return 1;
                break;
            case 'V': return 5;
                break;
            case 'X': return 10;
                break;

            case 'L': return 50;
                break;

            case 'C': return 100;
                break;

            case 'D': return 500;
                break;

            case 'M': return 1000;
                break;
        }
    });

    for (let index = 0; index < recorte.length; index++) {
        console.log(recorte[index]);

        if (recorte[index] < recorte[index + 1] ) {
            decimal -= recorte[index];
        }else {
            decimal += recorte[index];
        }
    }
    return decimal
}
console.log(`numero decimal ${transformar("XI")}`);




