const express = require('express');
const app = express();
const path=require('path');
const axios=require("axios");
const port=3000;
const rateLimit =require('express-rate-limit');

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
})

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
app.use(limiter);

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

/*API ROAD */
/* breaking bad quotes */
app.get("/api/breakingbad", (req, res) => {
    res.render("Api/breakingbad/brbad.ejs");
  });

app.post('/api/breakingbad',async (req ,res)=>{
    console.log(req.body)
    let {number}=req.body;
    console.log(number,"+++++++++");
    try {
        const result = await axios.get(`https://api.breakingbadquotes.xyz/v1/quotes/${number}`);
        console.log(result)
        let {data}=result;
        res.render('Api/breakingbad/brbad.ejs',{data});
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
})

/*Open weather map */
app.get("/api/openweathermap", (req, res) => {
    res.render("Api/openweathermap/openweathermap.ejs");
  });

app.post('/api/openweathermap',async (req,res)=>{
    //1detect the country switch many language
        //we use restcountries API
        console.log(req);
    let {ville,codepostal,pays}=req.body;
    console.log(pays)
    try {
        let resultCountry=await axios.get(`https://restcountries.com/v3.1/translation/${pays}`);
        // console.log(resultCountry.data);
        console.log("++++++++++++++++++++");
        if(resultCountry.data.status==404){
            console.log('------------------')
            res.redirect('/');
        }else{
            let isoCode;
            let paysInLow=pays.trim().toLowerCase()
            if(resultCountry.data.length>0){
                resultCountry.data.find(country =>{
                    const commonName = country.name.common.toLowerCase();
                    if (commonName === paysInLow) {
                       isoCode= country.cca2;
                    }
                       // Comparer avec les traductions (en minuscules)
                    if (country.translations) {
                        for (let translation of Object.values(country.translations)) {
                            if (translation.common && translation.common.toLowerCase() === paysInLow) {
                                isoCode= country.cca2;;
                            }
                        }
                    }
            });
                if (isoCode) {
                    // isoCode= countrySearch.cca2;  // 'cca2' est le code ISO 3166-1 alpha-2
                    console.log(isoCode+"++++++++++++++++++++++++++++");
                    if(req.body.codepostal){
                        let weather= await axios.get(`https://api.openweathermap.org/data/2.5/weather?zip=${codepostal},${isoCode}&lang=fr&units=metric&appid=21be37ca56279dd2b50ee0046841d733`)
                        .then((response)=>{
                            console.log(response.data);
                            // console.log("++++++++++");
                            let {data}=response;
                            res.render('Api/openweathermap/openweathermap.ejs',{data});
                        })
                        .catch(function(error){
                            console.log(error)
                        })
                    }
                    else{
                        let weather= await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${ville},{isoCode}&lang=fr&units=metric&appid=21be37ca56279dd2b50ee0046841d733`)
                        .then((response)=>{
                            console.log(response.data);
                            let {data}=response;
                            res.render('Api/openweathermap/openweathermap.ejs',{data});
                        })
                        .catch(function(error){
                            console.log(error)
                        })
                    }
                } else {
                    throw new Error("no isocode");
                }
            } else {
                throw new Error("Country not found.");
            }
        }
    } catch (error) {
        console.log(error)
        res.redirect('/');
    }
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