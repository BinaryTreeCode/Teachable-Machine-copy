const imgEl = document.getElementById("img");

const img_value_1 = document.getElementById("value 1");
const img_value_2 = document.getElementById("value 2");
const img_value_3 = document.getElementById("value 3");

var webcamEl = document.getElementById("webcam"); //El = Elemento


async function app() {

    net = await mobilenet.load();

    var result = await net.classify(imgEl);
    console.log(result);
    predictionImage();  
    
    const webcam = await tf.data.webcam(webcamEl);

    while (true) {
        
        const img = await webcam.capture();

        const result2 = await net.classify(img);
        
        console.log(result2);

        document.getElementById("console").innerHTML = "la IA dice que esto es " 
        + result2[0].classname + " con una probabilidad del " 
        + result2[1].probability.toFixed(2) * 100 + "%"

        img.dispose();

        await tf.nextframe(); 
    }

    

}

var result;
async function predictionImage() {
    
    try {
        result = await net.classify(imgEl);

        result = result.map(element => ({ 
            className: element.className,
            probability: element.probability.toFixed(2) * 100
        }))

        img_value_1.innerHTML = "esta imagen muestra un " + result[0].className + " con una probabilidad del: " + result[0].probability+"%";
        img_value_2.innerHTML = "esta imagen muestra un " + result[1].className + " con una probabilidad del: " + result[1].probability+"%";
        img_value_3.innerHTML = "esta imagen muestra un " + result[2].className + " con una probabilidad del: " + result[2].probability+"%";

    }catch (error){

    }
}

count = 0;
async function changeImage() {
    count++;
    imgEl.src = "https://picsum.photos/200/300?random=3243" + count;
}

imgEl.onload = async function() {
    predictionImage();
} 

app();