const imgEl = document.getElementById("img");

const img_value_1 = document.getElementById("value 1");
const img_value_2 = document.getElementById("value 2");
const img_value_3 = document.getElementById("value 3");

var webcamEl = document.getElementById("webcam"); //El = Elemento

const classifier = knnClassifier.create();

var net ;
var webcam;


async function app() {

    net = await mobilenet.load();

    var result_img = await net.classify(imgEl);
    console.log(result_img);
    predictionImage();  
    
    webcam = await tf.data.webcam(webcamEl);

    while (true) {
        
        const img = await webcam.capture();

        const result = await net.classify(img);
        
        console.log(result);

        document.getElementById("console").innerHTML = `La IA pre entrenada movilnet dice que esto es\n
        ${result[0].className} con una probabilidad del ${(result[0].probability*100).toFixed(2)}%`

        const activation = net.infer(img, 'conv_preds');

        var result2;

        try {
            result2 = await classifier.predictClass(activation);
            console.log(result2); 

        } catch (error) {
            result2 = {};
        }

        console.log(result2);

        const classes = ["no entrenada", "Example1", "Example2" , "Example3", "Example4","Example5"]

        try {
            document.getElementById("console2").innerText = `
          La IA que entrenaste predijo: ${classes[result2.label]}\n
          con una probabilidad de: ${(result2.confidences[result2.label]*100).toFixed(2)}%
          `;
          } catch (error) {
            document.getElementById("console2").innerText= "Untrained";
          }
      



        img.dispose();

        await tf.nextFrame();

    }

    

}

app();

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

async function addExample(classId) {
    const img = await webcam.capture();

    const activation = net.infer(img, true);
    classifier.addExample(activation, classId);

    console.log("se agrego el ejemplo" + img);

    img.dispose();
} 
