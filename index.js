const express = require('express');
const app = express();
const path=require('path');
const port=3000;


/*EJS PARAMS*/
//we setting view engine property from express with ejs
app.set('view engine', 'ejs');
//folder used for html parts
app.set('views',path.join(__dirname,'/views'))

//The middleware
//folder used for js,css,images (statics files)
app.use(express.static(path.join(__dirname, 'public')))
//to parse data receipt 
app.use(express.urlencoded({extended: true}));

//the seeds
let postData=[
    {title:'essai for Tobbi', 
    name:'drive son to the pool',
    content:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam euismod, lacus congue eleifend facilisis, sapien nisi tincidunt augue, non ultricies augue risus faucibus lacus. Phasellus a nisl ipsum. Donec maximus porttitor risus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Maecenas sed dapibus tellus. In felis lacus, pulvinar a libero a, bibendum.',
    category:'family',
    date:new Date().toLocaleString(),
    },  
    {title:'try for dog', 
    name:'go to the park with Rex',
    content:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam euismod, lacus congue eleifend facilisis, sapien nisi tincidunt augue, non ultricies augue risus faucibus lacus. Phasellus a nisl ipsum. Donec maximus porttitor risus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Maecenas sed dapibus tellus. In felis lacus, pulvinar a libero a, bibendum.',
    category:'family',
    date:new Date().toLocaleString(),
    },
    {title:'Modern', 
    name:'abracabrabra',
    content:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam auctor odio quis tortor venenatis, nec consectetur dolor porta. Vestibulum consectetur tempor ligula, vitae maximus sapien fringilla a. Nam bibendum pellentesque orci, eget volutpat dolor iaculis in. Mauris sit amet justo.',
    category:'hobbies',
    date:new Date().toLocaleString(),
    },
    {title:'Ilike coffe', 
    name:'in the afternoon',
    content:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus malesuada elit id rhoncus sollicitudin. Suspendisse fermentum pellentesque leo, a dignissim nunc sagittis efficitur. Maecenas malesuada, ligula sit amet auctor vehicula, urna odio ultricies lacus, eu. cofee is a best friends workers',
    category:'profesionnal',
    date:new Date().toLocaleString(),
    }
]

    //STEP 1= do the road
//home
app.get('/',(req,res)=>{
    res.render('home.ejs',({postdata:postData}));
});
//new
app.get('/post/new',(req,res)=>{
    res.render('new.ejs')
})

//show a post
app.get('/post/:title',(req,res)=>{
    let {title}=req.params;
    console.log(title);
    const thePost = postData.find(c => c.title === title);
    res.render('show',{thePost});
});
//create
app.post('/post/create',(req,res)=>{
    let {title,name,content, category}=req.body;
    postData.push({title,name,category,content});
    res.redirect('/')
})
//edit
app.get('/post/:title/edit',(req,res)=>{
    let {title}=req.params;
    const thePost = postData.find(c => c.title === title);
    res.render('edit',{thePost});
})
app.post('/post/edit',(req,res)=>{
    let {title,name,content, category}=req.body;
    let date=new Date().toLocaleString();
    let editData={title,name,category,content,date}
    let thePostindex = postData.findIndex(c => c.title === title);
    postData.splice(thePostindex,1,editData);
    res.redirect('/');
})

//delete
app.get("/delete/:title",(req,res)=>{
    let {title}=req.params;
    let thePostindex = postData.findIndex(c => c.title === title);
    postData.splice(thePostindex,1);
    console.table(postData);
    res.redirect('/');
})

//show category
app.get('/category/:catego',(req,res)=>{
    let category=req.params.catego;
    // console.log(category);
    const thePosts = postData.filter(c => c.category === category);
    // console.log(thePosts);
    // console.log("hejfhehflozfhvekizlfovceiko");
    res.render('category.ejs',{thePosts,category});
});
//About
app.get('/about',(req,res)=>{
    res.render('about.ejs');
})


//No road
app.get('*',(req,res)=>{
    res.send(`<h1>what's the F*** is ${req.url} url</h1>`);
});

app.listen(port,()=>{
    try{
    console.log('okay listen in '+port)
    }catch(e){
        console.log(e);
    }       
})