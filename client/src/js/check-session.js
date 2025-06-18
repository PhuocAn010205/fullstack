const checkSession = function(){
    let userSession = JSON.parse(localStorage.getItem('user-session'));

    // idea mình sẽ có 2 trường hợp TH1 là mình lấy được còn 
    // TH2 là khách hàng chưa login vào lần nào.
    if(userSession){
        const now = new Date().getTime();
        if(now >userSession.expiry){
            localStorage.removeItem('user-session');
            window.location.href ='login.html';
        }

    }else {
        window.location.href ='login.html';
    }
}
export {checkSession};