const popup = document.getElementById('popup');
    const overlay = document.getElementById('overlay');
    const popupImage = document.getElementById('popupImage');
    const popupText = document.getElementById('popupText');

    const banners = {
      1: {
        img: './src/img/thucdem.jpg',
        text: '<strong>CẢNH BÁO:</strong> <span> “Thức khuya không phải là siêng năng!”</span> - Ngày càng nhiều sinh viên rơi vào guồng quay thức khuya, ngủ sau 1 giờ sáng với lý do “phải học”, “chưa xong deadline”, hoặc đơn giản là... đang lướt mạng. Nhưng bạn có biết? Việc thức khuya kéo dài không giúp bạn giỏi hơn, mà đang âm thầm bào mòn trí nhớ, khiến đầu óc thiếu tập trung, tinh thần dễ tụt mood, và cơ thể ngày càng uể oải. Không chỉ vậy, thức khuya còn làm rối loạn đồng hồ sinh học, tăng nguy cơ trầm cảm và suy giảm hệ miễn dịch. Cà phê, mì gói và ánh sáng màn hình xanh có thể đang là “bạn thân” mỗi đêm, nhưng cũng là thứ đang âm thầm làm hại bạn. Đừng để những đêm trắng khiến bạn đánh đổi cả sức khỏe lẫn tương lai.<br> <b>Lời Khuyên:</b> Hãy ngủ đủ 7 -8 tiếng mỗi ngày, ưu tiên nghỉ ngơi trước 23h và học cách sắp xếp thời gian hiệu quả hơn. Là Gen Z, hãy sống thông minh - ngủ đủ để sống chất. Vì không phải bạn bận, mà là bạn chưa thực sự ưu tiên sức khỏe của chính mình.'


      },
      2: {
        img: './src/img/luovd.jpg',
text: '<strong>CẢNH BÁO: </strong><span>"Lười vận động không phải là thư giãn!"</span> Ngày càng nhiều sinh viên đang dành phần lớn thời gian ngồi một chỗ, dù là học bài, làm deadline, hay đơn giản chỉ là lướt mạng. Bạn có biết, việc lười vận động kéo dài không chỉ khiến cơ thể uể oải, mà còn âm thầm gây ra nhiều vấn đề sức khỏe nghiêm trọng? Việc thiếu vận động làm suy giảm tuần hoàn máu, khiến bạn dễ mệt mỏi, khó tập trung và giảm hiệu suất học tập. Không chỉ vậy, thói quen ít vận động còn tăng nguy cơ mắc các bệnh về tim mạch, béo phì, tiểu đường và thậm chí là trầm cảm. Những bữa ăn nhanh, nước ngọt và thời gian dài dán mắt vào màn hình máy tính, điện thoại đang âm thầm biến cơ thể bạn thành "kho chứa" bệnh tật. <br><b>Lời Khuyên: </b> Hãy bắt đầu vận động ngay hôm nay! Dù chỉ là 30 phút đi bộ mỗi ngày, tập vài động tác giãn cơ giữa giờ học, hay tham gia một môn thể thao yêu thích. Hãy ngủ đủ 7-8 tiếng, ăn uống lành mạnh và dành thời gian cho các hoạt động thể chất. Là giới trẻ, hãy sống thông minh - vận động để sống khỏe, sống chất! Vì không phải bạn bận, mà là bạn chưa thực sự ưu tiên sức khỏe của chính mình.Thiếu vận động dễ dẫn đến bệnh tim mạch, béo phì và các vấn đề xương khớp.'
      },
      3: {
        img: './src/img/anuong.jpg',
text: '<strong>CẢNH BÁO:</strong> <span> “Ăn uống bừa bãi - Cơ thể đang kêu cứu!” </span> Ngày càng nhiều sinh viên bỏ bữa, ăn uống vội vàng với mì gói, trà sữa, đồ chiên rán - chỉ vì “tiện”, “tiết kiệm” hay “bận học”. Theo khảo sát của Viện Dinh dưỡng Quốc gia (2022), có tới 63% sinh viên ăn ít hơn 2 bữa chính mỗi ngày và hơn 70% tiêu thụ đồ ăn nhanh ít nhất 3 lần/tuần. Những thói quen tưởng chừng vô hại này đang âm thầm gây ra nhiều hệ lụy: thiếu hụt vi chất như sắt, kẽm, vitamin B; suy giảm trí nhớ; rối loạn tiêu hóa; dễ tăng hoặc sụt cân mất kiểm soát. Đặc biệt, sinh viên bỏ bữa sáng thường gặp tình trạng mệt mỏi, mất tập trung và dễ cáu gắt hơn tới 40% so với nhóm ăn uống đầy đủ. Bánh mì chấm trà sữa, mì gói 3 phút, hay cà phê thay bữa sáng - nghe quen nhưng đang khiến sức khỏe của bạn xuống dốc nhanh hơn bạn tưởng.<br> <b>Lời Khuyên:</b>  Hãy bắt đầu thay đổi từ những điều nhỏ: ăn sáng đầy đủ dù chỉ là một quả trứng hay trái cây, hạn chế đồ ăn nhanh quá 2 lần mỗi tuần, uống nước lọc thay vì trà sữa và chuẩn bị sẵn đồ ăn nhẹ như hạt, sữa chua hoặc trái cây. Gen Z thông minh là biết ăn đủ, ngủ đủ và sống đủ - vì không có sức khỏe, mọi kế hoạch đều trở nên vô nghĩa.'
      },
      4: {
        img: './src/img/lamdung.png',
text: '<strong>CẢNH BÁO: </strong> <span>"Chất kích thích không phải là giải pháp!"</span> Sinh viên đang đối mặt với áp lực, và một số tìm đến chất kích thích như lối thoát, nghĩ rằng chúng giúp tập trung hay "thể hiện". Tuy nhiên, đây là con đường hủy hoại sức khỏe và tương lai. Thực trạng đáng báo động: Khoảng 70% người dùng ma túy là thanh niên, học sinh, sinh viên; 60% người dùng lần đầu ở Việt Nam thuộc độ tuổi 15-25. Đặc biệt, 7,3% thanh niên 15-24 tuổi đang dùng thuốc lá điện tử, và ma túy đang được ngụy trang tinh vi. Lạm dụng chất kích thích không chỉ gây nghiện, tàn phá sức khỏe thể chất (tim mạch, hô hấp, thần kinh) mà còn ảnh hưởng nghiêm trọng đến tinh thần, dẫn đến trầm cảm, ảo giác, và hủy hoại tương lai. <br><b>Lời khuyên:</b> Hãy tỉnh táo tránh xa chất kích thích. Tìm các giải pháp lành mạnh để giảm căng thẳng như tập thể dục, hoạt động ngoại khóa, hoặc chia sẻ với người thân. Là Gen Z, hãy sống thông minh - nói không với chất kích thích để sống khỏe, sống chất! Đừng đánh đổi sức khỏe và tương lai chỉ vì sự tò mò hay áp lực nhất thời.Chất kích thích gây nghiện và tổn hại não bộ, hệ tim mạch, gan và phổi.'
      }
    };

    function showPopup(index) {
      popupImage.src = banners[index].img;
      popupText.innerHTML = banners[index].text;
      popup.style.display =  'block';
      overlay.style.display = 'block';
    }

    function closePopup() {
      popup.style.display = 'none';
      overlay.style.display = 'none';
    }