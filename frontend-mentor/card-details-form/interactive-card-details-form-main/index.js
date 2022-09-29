//select onchange elements 
let frontCardNumber = document.getElementById('front-cardnumber');
let frontHolderName = document.getElementById('front-holdername');
let expMonth = document.getElementById('exp-month');
let expYear = document.getElementById('exp-year');
let cvcInput = document.getElementById('cvcinput');
//select confirm button
let confirmBtn = document.querySelector('.btn-confirm');

//select noticing elements
let noticeName = document.getElementById('notice-name');
let noticeNumber = document.getElementById('notice-number');
let noticeDate = document.getElementById('notice-date');
let noticeCvc = document.getElementById('second-p')
function changeName(name){
  if (name.length > 0){
    frontHolderName.textContent = name;
  }else{
    frontHolderName.textContent = "Jane Apleased";
  }
}
function changeNumber(number){
  if (number.length > 0){
    frontCardNumber.textContent = number;
  }else{
    frontCardNumber.textContent = "0000 0000 0000 0000";
  }
}
function changeMonth(month){
  if (month.length > 0){
    expMonth.textContent = month;
  }else{
    expMonth.textContent = "00";
  }
}
function changeYear(year){
  if (year.length > 0){
    expYear.textContent = year;
  }else{
    expYear.textContent = "00";
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  confirmBtn.addEventListener('click',()=>{
    let originName = 'Jane Apleased';
    if(frontHolderName.textContent === originName){
      noticeName.style.visibility = 'visible';
    }if(frontCardNumber.textContent === "0000 0000 0000 0000"){
      noticeNumber.style.visibility = 'visible';
    }if(expMonth.textContent==="00"||expYear.textContent==="00"){
      noticeDate.style.visibility = 'visible';
    }if(cvcInput.textContent.length === 0){
      noticeCvc.style.visibility = 'visible';
    }
  })
})