img = "";

//var to check the status of object detection
status = "";

//var to hold all the results
objects = [];

//var to hold sound
alarm = "";

//1. load the sound
function preload(){
    alarm = loadSound("alarm_sound.mp3");
}

function setup(){
    canvas = createCanvas(380,380); 
    var width = screen.width;
    if (width<992){
        canvas.center();
    }
    else{
        canvas.position(580,130);
    }

    //access the webcam
    video = createCapture(VIDEO);
    video.size(380,380);
    video.hide();

    //load the model
    objectDetector = ml5.objectDetector('cocossd' , modelLoaded);

    document.getElementById("status").innerHTML = "Status : Detecting Objects";
}

//define modelLoaded() function
function modelLoaded(){
    console.log("Model Loaded !");
    //update the status 
    status = true;
}

function draw(){
    //place image
    image(video,0,0,380,380);

    if(status != ""){
        //execute the model
        objectDetector.detect(video, gotResult);

        r = random(255);
        g = random(255);
        b = random(255);

        for(i = 0; i < objects.length; i++){

            fill(r,g,b);

            //store the confidence and convert it to percentage
            percent = floor(objects[i].confidence * 100);

            //display the label
            text(objects[i].label + " (" + percent + "%) ", objects[i].x + 15 , objects[i].y + 15);
            textSize(18);

            //unset the color
            noFill();

            //set the border color
            stroke(r,g,b);

            //draw the rectangle around the object
            rect(objects[i].x , objects[i].y , objects[i].width , objects[i].height);

            
        //2. a person is detected
        if(objects[i].label == "person"){
            //update the html tag with the status
            document.getElementById("status").innerHTML = "Baby Detected";
            //stop alarm
            alarm.stop();
        }
        else{   //3. a person is not detected
            //update the html tag with the appropriate status
            document.getElementById("status").innerHTML = "Baby Not Detected";
            //play the alarm
            alarm.play();
        }

        }

        //3. no object is detected
        if(objects.length <= 0){
            //update the html tag with the status
            document.getElementById("status").innerHTML = "Baby Not Detected";
            //play the alarm
            alarm.play();
        }

    }
}

//define gotResult() function
function gotResult(error, results){
    if (error){
        console.log(error);
    }
    else{
        console.log(results);
        //update the objects variable
        objects = results;
    }
}