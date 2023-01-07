<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?><!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<link rel="shortcut icon" href="<?php echo base_url() ?>/favicon.ico" type="image/x-icon">
<link rel="icon" href="<?php echo base_url() ?>/favicon.ico" type="image/x-icon">
<title>Error Custom</title>
<style type="text/css">

</style>
<body class="bg-purple">    
    <div class="stars">
        <div class="central-body">
            <h1 style="display: none;">404</h1>
            <h2>Check your data and <br> redo the action !!!</h2>
            <h3>LOOKS LIKE YOU ARE</h3>
            <h3>LOST IN SPACE</h3>
            <a href="<?php echo site_url("dashboard"); ?>" class="btn-go-home" target="_blank">GO BACK HOME</a>
        </div>
        <div class="objects">
            <img class="object_rocket" src="<?php echo base_url("assets/img/404/rocket.svg");?>" width="40px">
            <div class="earth-moon">
                <img class="object_earth" src="<?php echo base_url("assets/img/404/earth.svg");?>"width="100px">
                <img class="object_moon" src="<?php echo base_url("assets/img/404/moon.svg");?>" width="80px">
            </div>
            <div class="box_astronaut">
                <img class="object_astronaut" src="<?php echo base_url("assets/img/404/astronaut.svg"); ?>" width="140px">
            </div>
        </div>
        <div class="glowing_stars">
            <div class="star"></div>
            <div class="star"></div>
            <div class="star"></div>
            <div class="star"></div>
            <div class="star"></div>

        </div>

    </div>

    </body>

</html>
<style type="text/css">
@font-face {
font-family: 'Century Gothic Bold';
font-style: normal;
font-weight: normal;
src: local('Century Gothic Bold'), url('../fonts/GOTHICB.woff') format('woff');
}

@-moz-keyframes rocket-movement { 100% {-moz-transform: translate(1200px,-600px);} }
@-webkit-keyframes rocket-movement {100% {-webkit-transform: translate(1200px,-600px); } }
@keyframes rocket-movement { 100% {transform: translate(1200px,-600px);} }
@-moz-keyframes spin-earth { 100% { -moz-transform: rotate(-360deg); transition: transform 20s;  } }
@-webkit-keyframes spin-earth { 100% { -webkit-transform: rotate(-360deg); transition: transform 20s;  } }
@keyframes spin-earth{ 100% { -webkit-transform: rotate(-360deg); transform:rotate(-360deg); transition: transform 20s; } }

@-moz-keyframes move-astronaut {100% { -moz-transform: translate(-160px, -160px);}}
@-webkit-keyframes move-astronaut { 100% { -webkit-transform: translate(-160px, -160px);}}
@keyframes move-astronaut{100% { -webkit-transform: translate(-160px, -160px); transform:translate(-160px, -160px); }}
@-moz-keyframes rotate-astronaut {100% { -moz-transform: rotate(-720deg);}}
@-webkit-keyframes rotate-astronaut {100% { -webkit-transform: rotate(-720deg);}}
@keyframes rotate-astronaut{100% { -webkit-transform: rotate(-720deg); transform:rotate(-720deg); }}

@-moz-keyframes glow-star {40% { -moz-opacity: 0.3;}90%,100% { -moz-opacity: 1; -moz-transform: scale(1.2);}}
@-webkit-keyframes glow-star {40% { -webkit-opacity: 0.3;}90%,100% { -webkit-opacity: 1; -webkit-transform: scale(1.2);}}
@keyframes glow-star{40% { -webkit-opacity: 0.3; opacity: 0.3;  }90%,100% { -webkit-opacity: 1; opacity: 1; -webkit-transform: scale(1.4); transform: scale(1.4); border-radius: 999999px;}}
.spin-earth-on-hover{transition: ease 200s !important;transform: rotate(-3600deg) !important;}
html, body{margin: 0; width: 100%; height: 100%; font-weight: 300;-webkit-user-select: none; /* Safari 3.1+ */-moz-user-select: none; /* Firefox 2+ */-ms-user-select: none; /* IE 10+ */user-select: none; /* Standard syntax */
    font-family:'Century Gothic Regular' !important;}
.central-body{}
.central-body h1{font-size: 200px; font-weight: bold; margin-bottom: 0px; color: #fff; margin-top: 0px;}
.central-body h2{font-size: 50px; font-weight: bold; margin-bottom: 10px; color: #5bcbf5; margin-top: 0px;  font-family: 'Century Gothic Bold';}
.central-body h3{font-size: 20px; font-weight: lighter !important; margin-top: 0px; margin-bottom: 5px; color: #fff;}
.bg-purple{background: url("<?php echo base_url("assets/img/404/404_bg.png"); ?>");background-repeat: repeat-x;background-size: cover;background-position: left top;height: 100%;overflow: hidden;}
.btn-go-home{ position: relative; z-index: 200; margin: 15px auto; width: 150px; padding: 10px 15px; border: 1px solid #FFCB39; border-radius: 100px; font-weight: 400; display: block; color: white; text-align: center; text-decoration: none; letter-spacing : 2px; font-size: 11px;
    -webkit-transition: all 0.3s ease-in;
    -moz-transition: all 0.3s ease-in;
    -ms-transition: all 0.3s ease-in;
    -o-transition: all 0.3s ease-in;
    transition: all 0.3s ease-in;
}
.btn-go-home:hover{ background-color: #FFCB39; color: #000; font-weight: bold; transform: scale(1.05); box-shadow: 0px 20px 20px rgba(0,0,0,0.1);}
.central-body{/*    width: 100%;*/ padding: 17% 5% 10% 5%;text-align: center;}
.objects img{z-index: 90; pointer-events: none;}
.object_rocket{ z-index: 95;  position: absolute; transform: translateX(-50px); top: 75%; pointer-events: none; animation: rocket-movement 50s linear infinite both running;}
.object_earth{ position: absolute; top: 20%; left: 15%;z-index: 90; animation: spin-earth 50s infinite linear both;}
.object_moon{ position: absolute;top: 12%;left: 25%;transform: rotate(0deg);transition: transform ease-in 99999999999s;}
.earth-moon{}
.object_astronaut{animation: rotate-astronaut 200s infinite linear both alternate;}
.box_astronaut{ z-index: 110 !important; position: absolute; top: 67%;right: 20%; will-change: transform; animation: move-astronaut 50s infinite linear both alternate;}
.image-404{ position: relative; z-index: 100; pointer-events: none;}
.stars{ background: url("<?php echo base_url("assets/img/404/overlay_stars.svg"); ?>"); background-repeat: repeat;background-size: contain; background-position: left top;}
.glowing_stars .star{ position: absolute; border-radius: 100%;background-color: #fff; width: 3px; height: 3px; opacity: 0.3; will-change: opacity;}
.glowing_stars .star:nth-child(1){top: 80%; left: 25%;animation: glow-star 2s infinite ease-in-out alternate 1s;}
.glowing_stars .star:nth-child(2){top: 20%; left: 40%;animation: glow-star 2s infinite ease-in-out alternate 3s;}
.glowing_stars .star:nth-child(3){top: 25%; left: 25%;animation: glow-star 2s infinite ease-in-out alternate 5s;}
.glowing_stars .star:nth-child(4){top: 75%; left: 80%;animation: glow-star 2s infinite ease-in-out alternate 7s;}
.glowing_stars .star:nth-child(5){top: 90%; left: 50%;animation: glow-star 2s infinite ease-in-out alternate 9s;}

@media only screen and (max-width: 600px){
   .box_astronaut{top: 70%;}
   .central-body{padding-top: 25%}
}	
</style>



