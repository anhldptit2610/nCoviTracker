function getBotResponse(input) {

    // Nhiệt độ cơ thể 
    if (input == "xin chào") {
        return "Chào bạn , tôi là AI bot!";
    } else if (input == "Tôi đang bị sốt") {
        return "Hiện tại nhiệt độ cơ thể của bạn là bao nhiêu?";

    } else if (Number(input) >= 38) {
        return "Hãy uống thuốc hạ sốt đi nhé! Bác sĩ sẽ nhắn tin hoặc đến kiểm tra tình trạng của bạn";
    
    // Nhiệt độ phòng
    } else if (input == "Phòng tôi nóng quá") {
        return "Oh! Hệ thống sẽ tự động điều chỉnh nhiệt độ...Bạn thấy mát hơn chưa?";
    
    } else if (input == "Vẫn nóng") {
        return "Oh! Hệ thống sẽ tự động điều chỉnh nhiệt độ...Bạn thấy mát hơn chưa?";
    
    } else if (input == "Mát hơn rồi") {
        return "Tôi sẽ giữ mức nhiệt độ này nhé!";

    // Độ ẩm phòng
    } else if (input == "Da tôi khô quá") {
    return "Oh! Hệ thống sẽ tự động điều chỉnh độ ẩm... Bạn thấy ổn chưa ?";

    } else if (input == "Phòng tôi bị nồm") {
    return "Oh! Máy hút ẩm sẽ được bật.";

    // Không khí
    
    } else if (input == "Tôi thấy khó thở") {
    return "Có thể là do chất lượng không khí. Hệ thống sẽ bật thông gió";

    } else if (input == "Tôi vẫn khó thở") {
    return "Có lẽ do Covid đã ảnh hưởng tới phổi của bạn. Bác sĩ sẽ nhắn tin hoặc đến kiểm tra tình trạng của bạn";

    ///////////////
    } else if (input == "Ổn rồi") {
    return "Hãy yên tâm nhé! Hệ thống luôn theo dõi bạn";

    } else {
        return "xin lỗi tôi vẫn chưa đủ thông minh để hiểu ý bạn! Hãy viết đúng chính tả nhé";
    }
}