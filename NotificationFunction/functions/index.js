'use strict'


const functions = require('firebase-functions');

const admin=require('firebase-admin');

admin.initializeApp(functions.config().firebase);


exports.sendNotification=functions.database.ref('/notifications/{user_id}/{notification_id}').onWrite((change,context)=>{

  
const user_id=context.params.user_id;

  const notification_id = context.params.notification_id;


  console.log('We have a notification to send to: ',user_id);


  if(!change.after.val()){
  
  return console.log('A notification has been deleted from the database:',notification_id);
 
 }
  
const fromUser=admin.database().ref(`/notifications/`+user_id+`/`+notification_id).once('value');
return fromUser.then(fromUserResult=>{
const from_user_id=fromUserResult.val().from;
console.log('You have a new notification from:',from_user_id);

const fromUserName=admin.database().ref(`/Users/`+from_user_id+`/name`).once('value');
return fromUserName.then(userResult=>{
const userName=userResult.val();

const deviceToken=admin.database().ref(`/Users/`+user_id+`/token`).once('value');
 
 return deviceToken.then(result=>{
 
   const token_id=result.val();

    const payload={
    
  notification:{
        title:"Friend Request",
 
       		body:userName+` has sent you a friend request`

            }
,
data:{
from_user_id:from_user_id
}
    };
   
 return admin.messaging().sendToDevice(token_id,payload).then(response=>{
   
   console.log('Notification sent to',token_id);

    });


  });



});

});

});
