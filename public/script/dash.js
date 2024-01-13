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

//the categories table responsiveness starts here
// const table = document.querySelector('.cateTable');
// if(table.getElementsByTagName('tr')){
//    const rows = table.getElementsByTagName('tr');
   
//    for (let i = 0; i < rows.length; i++) {
//       const row = rows[i];
//       const cells = row.getElementsByTagName('td');
    
//       if(cells.length !== 0){
//          cells[4].addEventListener('click', function() {
//          console.log('The edit button clicked');
//          });
      
//          cells[5].addEventListener('click', function() {
//          console.log('The delete button clicked');
//          });
//       }
//     }
//    }   





////////////////////////////////////////////////////////








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

