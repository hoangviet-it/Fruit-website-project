import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import intro1 from '../../header/icon/intro1.jpg'
import intro2 from '../../header/icon/intro2.jpg'
import Home from '../../header/icon/home.svg'
import Next from '../../header/icon/next.svg'
import UpHeadPage from '../../header/icon/up.svg'
import HeaderFixed from '../../header/HeaderFixed'

export default function Intro() {
    const [btnBackTop, setBtnBackTop] = useState(false)
    const [header, setHeader] = useState(false)

    // xử lý ẩn hiện nút back to top khi cuộn chuột
    useEffect(()=>{
        window.onscroll = ()=> {
            const scrollFunction = ()=> {
                if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
                    setBtnBackTop(true)
                } else {
                    setBtnBackTop(false)
                }
            }
            scrollFunction()

            const scrollheader = ()=> {
                if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
                    setHeader(true)
                } else {
                    setHeader(false)
                }
            }
            scrollheader()
        }
    })

    // xử lý click nút back to top
    const scroll = () =>{
        function topFunction() {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }
        topFunction()
    }

  return (
    <>
    {
        header?<div className="headre-true-show"><HeaderFixed/></div>:<div className="header-homepage"><HeaderFixed/></div>
    }
    <div className="container-intro">
        <div className="crumb">
            <Link to='/' className="crumb-homepage">
                <img src={Home} alt=''></img>
                <span>Trang chủ</span>
            </Link>
            <img src={Next} alt=''></img>
            <span className="crumb-name">Giới thiệu</span>
        </div>
        <br></br>
        <h3>Câu chuyện từ HOANGVIETFRUIT</h3>
        <div className="desription-intro">
            <p>Thực phẩm xanh – sạch – ngon vẫn luôn là những tiêu chí hàng đầu giúp người tiêu dùng chọn lựa thực phẩm mỗi ngày. Thế nhưng khoảng thời gian gần đây lại có rất nhiều thương lái lợi dụng lòng tin của người tiêu dùng tráo các thực phẩm bẩn, kém chất lượng gây ảnh hưởng nghiêm trọng đến sức khỏe của mọi người.</p>
            <p>Đặc biệt với thị trường trái cây nhập khẩu thì tình trạng này lại tràn lan gây hoang mang cho người tiêu dùng. Nhận thấy những điều này, HOANGVIETFRUIT đã ra đời với sứ mệnh mang đến sức khỏe cho mọi nhà qua những loại trái cây ngoại nhập và nội địa thượng hạng, chất lượng với tiêu chuẩn 3C: CHUẨN TƯƠI – CHUẨN NGON – CHUẨN SẠCH.</p>
        </div>
        <div className="content1-intro">
            <div><img src={intro1} alt=''></img></div>
            <div className="item2-content1">
                <h4>ĐẾN TỪ SỰ CHÂN THÀNH</h4>
                <p>HOANGVIETFRUIT mong rằng sự chân thành và sự thấu hiểu nhu cầu khách hàng, chúng tôi muốn mang đến cho Quý khách những loại trái cây, rau, củ tươi ngon và chất lượng nhất . Từ những loại trái cây nhập khẩu đến những trái cây trong nước đều được chúng tôi nâng niu, tỉ mẩn thực hiện… hy vọng sẽ giúp lan tỏa sự yêu thương đến với từng gia đình, bạn bè, đồng nghiệp và đối tác của Quý khách.</p>
                
            </div>
        </div>
        <div className="content1-intro content2-intro">
            <div>
                <h4>SÁNG TẠO TRONG YÊU THƯƠNG</h4>
                <p>Sản phẩm quà tặng từ HOANGVIETFRUIT sẽ giúp Quý khách trao gửi đến người nhận những tình cảm chân thành. Chúng tôi sẽ luôn đồng hành cùng Quý khách trong những ngày hạnh phúc nhất, khi cưới hỏi hay lúc gặp mặt đối tác… cho đến những lần cần chia buồn. Mỗi cảm xúc của Quý khách luôn được HOANGVIETFRUIT quan tâm, trân trọng và mong muốn chia sẻ qua những sản phẩm của chúng tôi tạo nên. </p>
            </div>
            <div><img src={intro2} alt=''></img></div>
        </div>
        <Link to='#!' className={btnBackTop?"head-page":"none-head-page"} onClick={scroll}>
            <img src={UpHeadPage} alt="" width="15" />
        </Link>
    </div>
    </>
  )
}
