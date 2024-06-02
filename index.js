const express = require('express');
const users = require('./data.json')
const fs = require('fs')
const app = express();
const PORT = 8000;

//Middleware
app.use(express.urlencoded({ extended:false }))

//Routes:
app.listen(PORT,(req,res)=>{
    console.log(`Server running on port : ${PORT}`)
});

app.use((req,res,next)=>{
   // console.log('Hello from Middleware 1');
   // req.myUsername = 'Shubhamay'
   fs.appendFile('log.txt',`${Date.now()} : ${req.method} : ${req.path} from ip : ${req.ip} \n`,(err,data)=>{
    next();
   }) 

})

// app.use((req,res,next)=>{
//     console.log('Hello from Middleware 2',req.myUsername);
//     //return res.end('hey')
//     next();
// })

app.get('/api/users',(req,res)=>{
    return res.json(users)
});

app.get('/users', (req,res)=>{
    const html = `
    <ul>
        ${users.map((user)=>`<li>${user.first_name}</li>`).join("")}
    </ul>
    `;
    res.send(html);
});

app.get('/api/users/:id',(req,res)=>{
    const id = Number(req.params.id);
    //Can use both find and filter
   // const user = users.find((user)=>user.id === id);
    const user = users.filter((user)=>{
        return user.id === id;
    }) 
   return res.json(user);
})

//post
app.post('/api/users',(req,res)=>{
   const body = req.body;
   //console.log(body);
   users.push({...body,id : users.length + 1});
   fs.writeFile('./data.json',JSON.stringify(users),(err,data)=>{
      return res.json({status : 'pending', id: users.length})
   })
   // return res.send({status : 'pending'});
})

//patch
app.patch('/api/users/:id',(req,res)=>{
    //TODO : Update users
     // getId stores the Id from the given Parameters in the URL.
     const getId = Number(req.params.id);

     // body stores the body in which we've to make changes.
     const body = req.body;
 
     // Finding the user Id from the user array.
     const userIndex = users.findIndex((user) => user.id === getId);
 
     // If we found a user with its Id then gotUser stores that object.
     const gotUser = users[userIndex];
 
     // Here gotUser has the user Object and body has the changes we have to made.
     const updatedUser = { ...gotUser, ...body};
 
     // After Merging them, Update the users Array.
     users[userIndex] = updatedUser;
 
     // Lastly, write the changes into the json file.
     fs.writeFile('./data.json', JSON.stringify(users), (err, data) => {
       return res.json({ status: "Success", updatedUser});

})
});

//delete
app.delete('/api/users/:id',(req,res)=>{
    const id = Number(req.params.id);

    // Find the index of the user to be deleted
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ status: "Error", message: "User not found" });
    }

    // Remove the user from the array
    users.splice(userIndex, 1);

    fs.writeFile('./data.json',JSON.stringify(users),(err,data)=>{
        if(err){
            console.log(err)
        }else{
            return res.json({ status: "Success", id: users.length});
        }
    })

})




