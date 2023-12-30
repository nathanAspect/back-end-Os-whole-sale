const addNewCate = document.querySelector('.addNewCategory form');
const cateName = document.querySelector('.inputName');
const errorNote = document.querySelector('.errorNote');
const url = 'http://localhost:3000';

if(addNewCate){
   addNewCate.addEventListener('submit', event=>{
      event.preventDefault();
      const name = cateName.value;
      if(name===''){
         cateName.classList.toggle('redError');
         errorNote.style.opacity = 1;
         setTimeout(()=>{
            cateName.classList.toggle('redError');
            errorNote.style.opacity = 0;
         }, 2000)
         return;
      }
   
      fetch(url + '/dashboard/categories', {
         method: 'POST',
         body: JSON.stringify({ Name: name}),
         headers: {
           'Content-Type': 'application/json'
         }
       })
       .then(res=>res.json())
       .then(data=>{
          if(!data){
            cateName.classList.toggle('redError');
            errorNote.style.opacity = 1;
            setTimeout(()=>{
               cateName.classList.toggle('redError');
               errorNote.style.opacity = 0;
            }, 2000)
            return;
          } else{
             window.location.href = '/dashboard/categories';
          }
       })
       .catch(error=>{
          console.log(error);
       })
   })
}

//the product script goes here
const addProductBtn = document.querySelector('#addNewProductBtn');
const Pcategory = document.querySelector('#PCategory');

if(addProductBtn){

addProductBtn.addEventListener('click', ()=>{

   document.querySelector('.HolderForTheShow').style.display = 'none';
   document.querySelector('.productFormHolder').style.display = 'block';
   
   fetch(url + '/tool/getcategory')
   .then(result=>result.json())
   .then(result=>{
   for(let i = 0; i<result.length; i++){
   Pcategory.innerHTML += `<option value="${result[i].name}">${result[i].name}</option>`         
   }
   })
   .catch(err=>{
   console.log(err);
   })
   })

}

//the adding product script starts here
// const addNewProduct = document.querySelector('.addProduct');
// const Pname = document.querySelector('#PName');
// const Pprice = document.querySelector('#PPrice');
// const Pquantity = document.querySelector('#PQuantity');
// const Pimage = document.querySelector('#PImage');
// const Plink = document.querySelector('#PLink');
// const PCategory = document.querySelector('#PCategory');


//    addNewProduct.addEventListener('submit', (event)=>{
//       event.preventDefault();
//       if(Pname.value===''||Pprice.value===''||Pquantity===''||Pimage.files.length===0||Plink.value===''||Pcategory.value===''){
//          console.log('something is empty');
//       }
//    })