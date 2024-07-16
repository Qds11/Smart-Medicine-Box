
//checks if name input field is filled in sign up page
function checkUserFullName(){
    //gets user input
    var userFullName = document.getElementById("userFullName").value;
    var flag = false;
    
    if(userFullName === ""){
        flag = true;
    }
    //if name input field is empty, text to prompt user to fill in the name input is diplayed
    if(flag){
        document.getElementById("userFullNameError").style.display = "block";
    }else{//if name input field is filled, no text to prompt user is displayed
        document.getElementById("userFullNameError").style.display = "none";
    }
}


//checks if email input format is correct in sign up page
function checkUserEmail(){
    //gets user input
    var userEmail = document.getElementById("userEmail");
    //correct email format
    var userEmailFormate = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var flag;
    if(userEmail.value.match(userEmailFormate)){
        flag = false;
    }else{
        flag = true;
    }
    //if input email doesn't match the correct email format, text to prompt user to input an email with a correct format is displayed 
    if(flag){
        document.getElementById("userEmailError").style.display = "block";
    }else{//if input email matches the correct email format, text to prompt user is not displayed
        document.getElementById("userEmailError").style.display = "none";
    }
}

//checks if password input format is correct in sign up page
function checkUserPassword(){
    //gets user input
    var userPassword = document.getElementById("userPassword");
    //correct password format
    var userPasswordFormate = /(?=.*\d)(?=.*[a-z]).{6,}/;      
    var flag;
    if(userPassword.value.match(userPasswordFormate)){
        flag = false;
    }else{
        flag = true;
    }  
    //if input password doesn't match the correct password format, text to prompt user to input password with a correct format is displayed 
    if(flag){
        document.getElementById("userPasswordError").style.display = "block";
    }else{//if input password matches the correct email format, text to prompt user is not displayed
        document.getElementById("userPasswordError").style.display = "none";
    }
}

//submitting and creating new user in firebase authentication 
function signUp(){
    //gets user input
    var userFullName = document.getElementById("userFullName").value;
    var userEmail = document.getElementById("userEmail").value;
    var userPassword = document.getElementById("userPassword").value;
    var productID=document.getElementById("productID").value;
    //correct input format
    //var userFullNameFormate = /^([A-Za-z.\s_-])/;    
    var userEmailFormate = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var userPasswordFormate = /(?=.*\d)(?=.*[a-z]).{6,}/;    
   // var productIDFormate = /(?=.*\d)(?=.*[A-Z]).{4,}/;    
    //compares user input against correct input format
   // var checkUserFullNameValid = userFullName.match(userFullNameFormate);
    var checkUserEmailValid = userEmail.match(userEmailFormate);
    var checkUserPasswordValid = userPassword.match(userPasswordFormate);
    //var checkproductIDValid=productID.match(productIDFormate);
    //if user inputs do not match the correct input format, text to prompt user to input their entries in a correct format
    if(userFullName == ''){
        return checkUserFullName();
    }else if(checkUserEmailValid == null){
        return checkUserEmail();
    }else if(checkUserPasswordValid == null){
        return checkUserPassword();
    
    }else if(productID==''){
        return checkproductID();
    }
    else{ 
        //retrieve values of the child under "valid_ids"
        firebase.database().ref(`valid_ids/${productID}`).once('value').then(snapshot=> {
        console.log(snapshot.val());
        //if value retrieved is true; product ID inputted by user is valid
            if(snapshot.val()!=null){
                console.log(snapshot.val());   
                //create account for user 
                firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword).then((success) => {
                    var user = firebase.auth().currentUser;
                    var uid;
                    console.log(uid);
                    if (user != null) {
                        //get unique user ID
                        uid = user.uid;
                    }

                    var firebaseRef = firebase.database().ref();
                    //data to be saved
                    var userData = {
                        user: {userFullName:userFullName,userEmail: userEmail,userPassword: userPassword},
                        morning:{morning_alarm: "Nil", morning_meds:""},
                        afternoon:{afternoon_alarm: "Nil", afternoon_meds:""},
                        evening:{evening_alarm:"Nil", evening_meds:""},
                        current_dosage:{morning_dosage:{0:"-",1:"-",2:"-",3:"-",4:"-",5:"-",6:"-"},
                        afternoon_dosage:{0:"-",1:"-",2:"-",3:"-",4:"-",5:"-",6:"-"},
                        evening_dosage:{0:"-",1:"-",2:"-",3:"-",4:"-",5:"-",6:"-"}},
                        current_dates:{0:"-",1:"-",2:"-",3:"-",4:"-",5:"-",6:"-"},
                        past_dosage:{ past_morn_dosage:{0:"-",1:"-",2:"-",3:"-",4:"-",5:"-",6:"-"},
                        past_noon_dosage:{0:"-",1:"-",2:"-",3:"-",4:"-",5:"-",6:"-"},
                        past_even_dosage:{0:"-",1:"-",2:"-",3:"-",4:"-",5:"-",6:"-"}},
                        past_dates:{0:"-",1:"-",2:"-",3:"-",4:"-",5:"-",6:"-"},
                        med_timing:{morn_time:"0", noon_time:"0", even_time:"0"},
                        missed_dosages:{even_missed:"0",noon_missed:"0",morn_missed:"0",
                                     even_taken:"0",noon_taken:"0",morn_taken:"0",
                                     even_total:"0",noon_total:"0",morn_total:"0"}
                    }
                    //set data above in the database
                    firebaseRef.child(uid).set(userData);
                    //message box to indicate account is created
                    alert('Your Account Created');
                    //redirect user to sign in page
                    window.location = "index.html"; 
                        
                }).catch((error) => {
                        //Handle Errors here.
                    //message box to indicate error in account creation
                    alert("Error")
                 });
            }
            //if value retrieved is null
            else{
                //message box to indicate that the product ID the user has inputted in invalid
                alert("Enter a valid product ID!");
             }
        });
          
    }
} 


function showlastweek(){
    //show last week's dosage history
    document.getElementById("lastweek").style.display = "block";
    //hide current dosage history
    document.getElementById("current").style.display = "none";
}

function showcurrent(){
    //hide last week's dosage history
    document.getElementById("lastweek").style.display = "none";
    //show current dosage history
    document.getElementById("current").style.display = "block";
}

//checks if product ID input field is filled
function checkproductID(){
    //gets user input
    var productID = document.getElementById("productID").value;
    var flag = false;
    if(productID === ""){
        flag = true;
    }
    //if name input field is empty, text to prompt user to fill in the name input is diplayed
    if(flag){
        document.getElementById("productIDError").style.display = "block";
    }else{//if name input field filled, no text to prompt user is displayed
        document.getElementById("productIDError").style.display = "none";
    }
}

//checks if email input format is correct in sign in page
function checkUserSIEmail(){
    //get user input
    var userSIEmail = document.getElementById("userSIEmail");
    //correct email format
    var userSIEmailFormate = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var flag;
    if(userSIEmail.value.match(userSIEmailFormate)){
        flag = false;
    }else{
        flag = true;
    }
    //if input email doesn't match the correct email format, text to prompt user to input an email with a correct format is displayed 
    if(flag){
        document.getElementById("userSIEmailError").style.display = "block";
    }else{//if input email matches the correct email format, no text to prompt user is displayed
        document.getElementById("userSIEmailError").style.display = "none";
    }
}

//checks if password input format is correct in sign in page
function checkUserSIPassword(){
    //get user input
    var userSIPassword = document.getElementById("userSIPassword");
    //correct password format
    var userSIPasswordFormate = /(?=.*\d)(?=.*[a-z]).{6,}/;      
    var flag;
    if(userSIPassword.value.match(userSIPasswordFormate)){
        flag = false;
    }else{
        flag = true;
    }  
    //if input password doesn't match the correct password format, text to prompt user to input an password with a correct format is displayed   
    if(flag){
        document.getElementById("userSIPasswordError").style.display = "block";
    }else{//if input password matches the correct password format, no text to prompt user is displayed
        document.getElementById("userSIPasswordError").style.display = "none";
    }
}
//checks email or password exsist in firebase authentication 
function signIn(){
    //get user inputs
    var userSIEmail = document.getElementById("userSIEmail").value;
    var userSIPassword = document.getElementById("userSIPassword").value;
    //correct input format
    var userSIEmailFormate = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var userSIPasswordFormate = /(?=.*\d)(?=.*[a-z]).{6,}/;      
    //compares user input against correct input format
    var checkUserEmailValid = userSIEmail.match(userSIEmailFormate);
    var checkUserPasswordValid = userSIPassword.match(userSIPasswordFormate);
    //if user inputs do not match the correct input format, text to prompt user to input their entries in a correct format
    if(checkUserEmailValid == null){
        return checkUserSIEmail();
    }else if(checkUserPasswordValid == null){
        return checkUserSIPassword();
    }else{//if user inputs matches the correct input format, sign in user with email and password
        firebase.auth().signInWithEmailAndPassword(userSIEmail, userSIPassword).then((success) => {
            //message box displayed to indicate successful sign in
            alert("Successfully signed in");
            //direct user to main.html page
            window.location = "main.html"; 
        }).catch((error) => {
            //message box displayed to indicate error in signing in
            alert("Error")
        });
    }
}

//get data from database and displayed in the page 
firebase.auth().onAuthStateChanged((user)=>{
    if (user) {
    //   User is signed in.
        let user = firebase.auth().currentUser;
        let uid
        if(user != null){
            uid = user.uid;
        }
    //##########################DATA FROM DATABASE RETRIEVED################################
       //gets user's name to be displayed in navigation bar
        firebase.database().ref(uid).child('/user/').on('value', (dataSnapShot)=>{
            document.getElementById("userPfFullName").innerHTML = "Hello"+" "+dataSnapShot.val().userFullName+"!";
        })
    
        firebase.database().ref(uid).child('/morning/').on('value', (dataSnapShot)=>{
            //gets morning alarm set to be displayed in set alarms page
            document.getElementById("alarm1").innerHTML ="Time Set:"+" "+dataSnapShot.val().morning_alarm;
            //gets morning alarm set to be displayed in home page
            document.getElementById("alarm1_home").innerHTML =dataSnapShot.val().morning_alarm;
            //gets morning medications to be displayed in add medication page
            document.getElementById("morn_meds").innerHTML=dataSnapShot.val().morning_meds;
            //gets morning medications set to be displayed in home page
            document.getElementById("morn_med_home").innerHTML=dataSnapShot.val().morning_meds;

        })
        firebase.database().ref(uid).child('/afternoon/').on('value', (dataSnapShot)=>{
            //gets afternoon alarm set to be displayed in set alarms page
            document.getElementById("alarm2").innerHTML = "Time Set:"+" "+dataSnapShot.val().afternoon_alarm;
            //gets afternoon alarm set to be displayed in home page
            document.getElementById("alarm2_home").innerHTML = dataSnapShot.val().afternoon_alarm;
             //gets afternoon medications to be displayed in add medication page
            document.getElementById("noon_meds").innerHTML=dataSnapShot.val().afternoon_meds;
            //gets afternoon medications set to be displayed in home page
            document.getElementById("noon_med_home").innerHTML=dataSnapShot.val().afternoon_meds;

        })
        firebase.database().ref(uid).child('/evening/').on('value', (dataSnapShot)=>{
            //gets evening alarm set to be displayed in set alarms page
            document.getElementById("alarm3").innerHTML ="Time Set:"+" "+ dataSnapShot.val().evening_alarm;
            //gets evening alarm set to be displayed in home page
            document.getElementById("alarm3_home").innerHTML = dataSnapShot.val().evening_alarm;
            //gets evening medications to be displayed in add medication page
            document.getElementById("even_meds").innerHTML=dataSnapShot.val().evening_meds;
            //gets evening medications set to be displayed in home page
            document.getElementById("even_med_home").innerHTML=dataSnapShot.val().evening_meds;
        })
        firebase.database().ref(uid).child('/missed_dosages/').on('value', (dataSnapShot)=>{
            //gets missed doses to be displayed in home page
            document.getElementById("morn_missed").innerHTML=dataSnapShot.val().morn_missed;
            document.getElementById("noon_missed").innerHTML=dataSnapShot.val().noon_missed;
            document.getElementById("even_missed").innerHTML=dataSnapShot.val().even_missed;
           
        })
        firebase.database().ref(uid).child('/med_timing/').on('value', (dataSnapShot)=>{
            //get values of before/after combo box selection and set them as property values 
            //0 before/after
            //1 after
            //2 before
            $('[name=morn_select]').val(dataSnapShot.val().morn_time);
            $('[name=noon_select]').val(dataSnapShot.val().noon_time);
            $('[name=even_select]').val(dataSnapShot.val().even_time);
           
        })

        // gets this week's morning dosage history to be displyed in dosage history page
        firebase.database().ref(uid).child('/current_dosage/').child('/morning_dosage/').on('value', (dataSnapShot)=>{
            var tr = "";
            var days=dataSnapShot.val();  
          tr = "<td class=selected>"+"Morning"+"</td>";
            //for loop used to get data which is stored in an array format
            //creation of table cells using for loop
          for (var i = 0; i <= 6; i++) {            
              tr += "<td class=input>"+days[i]+"</td>";
            }
            //display in dosage history page
            document.getElementById("morning_dosage").innerHTML = tr;

        })

        // gets last week's morning dosage history to be displyed in dosage history page
        firebase.database().ref(uid).child('/past_dosage/').child('/past_morn_dosage/').on('value', (dataSnapShot)=>{
            var tr = "";
            var days=dataSnapShot.val();  
          tr = "<td class=selected>"+"Morning"+"</td>";
          //for loop used to get data which is stored in an array format
            //creation of table cells using for loop
          for (var i = 0; i <= 6; i++) {            
              tr += "<td class=input>"+days[i]+"</td>";
            }
            //display in dosage history page
            document.getElementById("past_morn_dosage").innerHTML = tr;

        })

        // gets this week's afternoon dosage history to be displyed in dosage history page
        firebase.database().ref(uid).child('/current_dosage/').child('/afternoon_dosage/').on('value', (dataSnapShot)=>{
            var tr = "";
            var days=dataSnapShot.val();  
            tr = "<td class= selected>"+"Noon"+"</td>";
            //for loop used to get data which is stored in an array format
            //creation of table cells using for loop
          for (var i = 0; i <= 6; i++) {            
              tr += "<td class= input>"+days[i]+"</td>";
            }
            //display in dosage history page
            document.getElementById("afternoon_dosage").innerHTML = tr;

        })

        // gets last week's afternoon dosage history to be displyed in dosage history page
        firebase.database().ref(uid).child('/past_dosage/').child('/past_noon_dosage/').on('value', (dataSnapShot)=>{
            var tr = "";
            var days=dataSnapShot.val();  
            tr = "<td class= selected>"+"Noon"+"</td>";
            //for loop used to get data which is stored in an array format
            //creation of table cells using for loop
          for (var i = 0; i <= 6; i++) {            
              tr += "<td class= input>"+days[i]+"</td>";
            }
            //display in dosage history page
            document.getElementById("past_noon_dosage").innerHTML = tr;


        })

        // gets this week's evening dosage history to be displyed in dosage history page
        firebase.database().ref(uid).child('/current_dosage/').child('/evening_dosage/').on('value', (dataSnapShot)=>{
            var tr = "";
            var days=dataSnapShot.val();  
           tr = "<td class=selected>"+"Evening"+"</td>";
           //for loop used to get data which is stored in an array format
            //creation of table cells using for loop
          for (var i = 0; i <= 6; i++) {            
              //tr += "<td class=input>"+days[i]+"</td>";
              tr += "<td class=input>"+days[i]+"</td>";
            }
            //display in dosage history page
            document.getElementById("evening_dosage").innerHTML = tr;

        })

        // gets last week's afternoon dosage history to be displyed in dosage history page
        firebase.database().ref(uid).child('/past_dosage/').child('/past_even_dosage/').on('value', (dataSnapShot)=>{
            var tr = "";
            var days=dataSnapShot.val();  
           tr = "<td class=selected>"+"Evening"+"</td>";
           //for loop used to get data which is stored in an array format
            //creation of table cells using for loop
          for (var i = 0; i <= 6; i++) {            
              tr += "<td class=input>"+days[i]+"</td>";
            }
            //display in dosage history page
            document.getElementById("past_even_dosage").innerHTML = tr;

        })
        
        // gets last week's dates to be displyed in dosage history page
        firebase.database().ref(uid).child('/past_dates/').on('value', (dataSnapShot)=>{
            var tr = "";
            var days=dataSnapShot.val();  
           tr = "<td class=selected>"+"Date"+"</td>";
           //for loop used to get data which is stored in an array format
            //creation of table cells using for loop
          for (var i = 0; i <= 6; i++) {            
              tr += "<td class=selected>"+days[i]+"</td>";
            }
            //display in dosage history page
            document.getElementById("past_dates").innerHTML = tr;

        })
        //display this week's dates in dosage history page
        getCurrentWeek();
        //show this week's dosage history in dosage history page
        showcurrent();
        //calls renderTime() function every 50ms
        setInterval(renderTime, 50);
    } else {
    //   No user is signed in.
    }
});

// working for sign out
function signOut(){
    //use firebase authentication to sign user out
    firebase.auth().signOut().then(function() {
        //message box displayed to indicate that user has signed out
       alert("Signed Out");
       //user directed to sign in page
       window.location="index.html";
        
    }).catch(function(error) {
        // An error happened.
        let errorMessage = error.message;
        swal({
            type: 'error',
            title: 'Error',
            text: "Error",
        })
    });
}

//converts 24hr time to 12hr time 
function tConvert (time) {
    // check correct time format and split into components
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)?$/) || [time];
    // if time format correct
    if (time.length > 1) 
    { time = time.slice (1);  // remove full string match value
      time[5] = +time[0] < 12 ? 'AM' : 'PM'; // set AM/PM
      time[0] = +time[0] % 12 || 12; // convert hours
      if (time[0]<10)//if single digit, add "0" infront of string
      {
          time[0]="0"+time[0];
      }
    }
    else{
        //time input is empty when "set alarm" button is pressed, time set is "Nil"
        time="Nil";
        return time
    }
    // return converted time or original string
    return time.join (''); 
  }
  
 

//generate and display current time       
function renderTime() {
    var now = new Date();
    //gets current day of week and date
    var today = now.toDateString();
    //gets current time
    var time = now.toLocaleTimeString();
    //displays time and date in header
    document.getElementById("datetime_disp").innerHTML = time + "," + " " + " " + today;
   
}


//set morning alarm
function insert1() {
    //get new morning alarm time and convert it from 24hr time to 12hr time 
    morn_alarm= tConvert (alarm_1.value);
    let user=firebase.auth().currentUser;
    let uid;
    //if user is signed in
    if(user!=null){
        //get user ID
        uid=user.uid;
    }
    //store new alarm time in database
    firebase.database().ref(uid).child('/morning/').child('/morning_alarm/').set(morn_alarm);
 
}
    

    
//set afternoon alarm
function insert2() {
    //get new afternoon alarm time and convert it from 24hr time to 12hr time
    noon_alarm= tConvert (alarm_2.value);
    let user=firebase.auth().currentUser;
    let uid;
    //if user is signed in
    if(user!=null){
        //get user ID
        uid=user.uid;
    }
    //store new alarm time in database
   firebase.database().ref(uid).child('/afternoon/').child('/afternoon_alarm/').set(noon_alarm);
}

//set evening alarm
function insert3() {
  //get new evening alarm time and convert it from 24hr time to 12hr time
   even_alarm= tConvert (alarm_3.value);
   let user=firebase.auth().currentUser;
   let uid;
   //if user is signed in
   if(user!=null){
       //get user ID
       uid=user.uid;
   }
   //store new alarm time in database
   firebase.database().ref(uid).child('/evening/').child('/evening_alarm/').set(even_alarm);
}

//save text inputs for morning medications
function save1(){
    //gets text in morning medication text box
    var med1=document.getElementById("morn_meds").value;
    let user=firebase.auth().currentUser;
    let uid;
    //if user is signed in
    if(user!=null){
        //get user ID
        uid=user.uid;
    }
    //store text inputs in database
    firebase.database().ref(uid).child('/morning/').child('/morning_meds/').set(med1);
   
}

//save text inputs for afternoon medications
function save2(){
    //gets text in afternoon medication text box
    var med2=document.getElementById("noon_meds").value;
    let user=firebase.auth().currentUser;
    let uid;
    //if user is signed in
    if(user!=null){
        //get user ID
        uid=user.uid;
    }
    //store text inputs in database
    firebase.database().ref(uid).child('/afternoon/').child('/afternoon_meds/').set(med2);
}

//save text inputs for evening medications
function save3(){
    //gets text in evening medication text box
    var med3=document.getElementById("even_meds").value;
    let user=firebase.auth().currentUser;
    let uid;
    //if user is signed in
    if(user!=null){
        //get user ID
        uid=user.uid;
    }
    //store text inputs in database
    firebase.database().ref(uid).child('/evening/').child('/evening_meds/').set(med3);
}

//saves morning before/after food combo box selection
function morn_combo(){
    let user=firebase.auth().currentUser;
    let uid;
    //if user is signed in
    if(user!=null){
        //get user ID
        uid=user.uid;
    }
    //gets morning food combo box property value
    var x= document.getElementById("morn_select").value;
     //store morning food combo box property value in database
    firebase.database().ref(uid).child('/med_timing/').child('/morn_time/').set(x);
}

//saves afternoon before/after food combo box selection
function noon_combo(){
    let user=firebase.auth().currentUser;
    let uid;
    //if user is signed in
    if(user!=null){
        //get user ID
        uid=user.uid;
    }
    //gets afternoon food combo box property value
    var x= document.getElementById("noon_select").value;
    //store afternoon food combo box property value in database
    firebase.database().ref(uid).child('/med_timing/').child('/noon_time/').set(x);

}

//saves evening before/after food combo box selection
function even_combo(){
    let user=firebase.auth().currentUser;
    let uid;
    //if user is signed in
    if(user!=null){
        //get user ID
        uid=user.uid;
    }
    //gets evening food combo box property value
    var x= document.getElementById("even_select").value;
    //store evening food combo box property value in database
    firebase.database().ref(uid).child('/med_timing/').child('/even_time/').set(x);

}

//gets dates for the current week using moment.js      
function getCurrentWeek() {
    let user=firebase.auth().currentUser;
    let uid;
    //if user is signed in
    if(user!=null){
        //get user ID
        uid=user.uid;
    }
    //assigning an instance of momentjs to variable currentDate
    var currentDate = moment();
    //gets this week's monday date and time
    var weekStart = currentDate.clone().startOf('isoWeek');
    //make days variable contain a list
    var dates = [];
    var tr = "";
    //creation of table cell with "Date" text 
    tr = "<tr><td>"+"Date"+"</td></tr>";
    for (var i = 0; i <= 6; i++) {
        //loop through 6 days in the week starting from monday
        //create table cells and add consecutive dates to cells
        var dates=moment(weekStart).add(i, 'days').format("DD/MM");    
        tr += "<tr><td>"+dates+"</td></tr>";
        //store dates in database
        firebase.database().ref(uid).child('/current_dates/').child([i].toString()).set(dates);

    }
    //display dates in cells in dosage history page
    document.getElementById("date").innerHTML = tr;
 }

