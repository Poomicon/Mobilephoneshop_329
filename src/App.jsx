

import { people } from './data.js';
import { useState } from 'react';
import { getImageUrl } from './utils.js';

export default function List() {
  const [card, setCard] = useState([]);
  const [quantities, setQuantities] = useState({}); // สร้าง state สำหรับจำนวนของสินค้าในตะกร้า
  const [coupon, setCoupon] = useState(''); // คูปองที่เลือก
  const [discount, setDiscount] = useState(0); // ส่วนลด
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false); // สถานะการยืนยันการสั่งซื้อ
  const shippingCost = 100; // กำหนดค่าส่ง 100 บาท
  const validCoupons = {
    'FREESHIP': 'freeship', // คูปองสำหรับจัดส่งฟรี ไม่มีส่วนลด
    '20PERCENT': 'percent', // คูปองสำหรับลด 20%
    'SAVE20': 20,   // คูปองสำหรับลด 20 บาท
  };

  // เพิ่มสินค้าไปยังตะกร้า
  function addTocard(prd) {
    if (!card.some(item => item.id === prd.id)) {
      setCard([...card, prd]);
      setQuantities({
        ...quantities,
        [prd.id]: 1 // เริ่มต้นจำนวนสินค้าเป็น 1 เมื่อเพิ่มเข้าตะกร้า
      });
    }
  }

  // ลบสินค้าออกจากตะกร้า
  function removeFromCard(id) {
    setCard(card.filter(product => product.id !== id));
    const newQuantities = { ...quantities };
    delete newQuantities[id]; // ลบจำนวนสินค้าที่เกี่ยวข้องออก
    setQuantities(newQuantities);
  }

 // ฟังก์ชันอัปเดตจำนวนสินค้า
 const updateQuantity = (productId, delta) => {
  setQuantities((prevQuantities) => {
    const updatedQuantities = { ...prevQuantities };
    const newQuantity = (updatedQuantities[productId] || 1) + delta;
    updatedQuantities[productId] = newQuantity > 0 ? newQuantity : 1; // ไม่ให้ค่าจำนวนติดลบ
    return updatedQuantities;
  });
};

  // คำนวณราคาสินค้ารวม
  function calculateTotal() {
    return card.reduce((total, product) => {
      const quantity = quantities[product.id] || 1;
      return total + (product.pcine *quantities[product.id]);
    }, 0);
  }

  // ฟังก์ชันเลือกคูปอง
  const applyCoupon = (event) => {
    setCoupon(event.target.value);
  };

 // คำนวณส่วนลดคูปอง
 const calculateDiscount = (total) => {
  const couponValue = validCoupons[coupon];
  if (!couponValue) return 0; // ถ้าไม่มีคูปองคืนค่า 0

  if (couponValue === 'percent') {
    return total * 0.2; // ส่วนลด 20%
  } else if (couponValue === 'freeship') {
    return 0; // จัดส่งฟรี
  } else {
    return Math.min(couponValue, total); // ส่วนลดเป็นจำนวนเงิน เช่น 20 บาท
  }
};
// คำนวณราคาสินค้ารวม พร้อมส่วนลดและค่าส่ง
function calculateTotal() {
  const subtotal = card.reduce((total, product) => {
    const quantity = quantities[product.id] || 1;
    return total + (product.price * quantity);
  }, 0);

  const discount = calculateDiscount(subtotal); // หาส่วนลดตามคูปอง
  const shipping = coupon === 'FREESHIP' ? 0 : shippingCost; // ถ้ามีคูปองจัดส่งฟรี จะไม่คิดค่าส่ง

  return subtotal - discount + shipping; // คืนค่าสุทธิหลังหักส่วนลดและบวกค่าส่ง
}

  // ฟังก์ชันยืนยันการสั่งซื้อ
  const confirmOrder = () => {
    setIsOrderConfirmed(true);
    alert("การสั่งซื้อของคุณได้รับการยืนยันแล้ว!");
  };

  // รายการสินค้าที่มีให้เลือก
  const listItems = people.map(person => (
    <li key={person.id}>
      <img src={getImageUrl(person)} alt={person.name} />
      <p><b>{person.name+' '}</b><br/>
      {person.profession+' '}:{' '+person.accomplishment}<br/>
      {person.price+' '}บาท
      </p>
      <button onClick={() => addToCard(person)}>เพิ่มลงในตะกร้า</button>
    </li>
  ));

  // ฟังก์ชันเพิ่มสินค้าในตะกร้า
  const addToCard = (product) => {
    setCard((prevCard) => [...prevCard, product]);
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [product.id]: (prevQuantities[product.id] || 1)
    }));
  };

  return (
    <article>
      <div className="menu">
        <h1>Shopping Cart</h1>
        {card.length === 0 ? (
          <p>ตะกร้าของคุณว่างเปล่า</p>
        ) : (
          <div>
            {card.map(product => (
              <div key={product.id}>
                <img src={getImageUrl(product)} alt={product.name} />
                <p>
                  <button className='qua'onClick={() => updateQuantity(product.id, -1)}>–</button>
                  <b>{' '+quantities[product.id]+'  '}</b>
                  <button className='qua' onClick={() => updateQuantity(product.id, 1)}>+</button><br />
                  {product.name}: {product.price+'  '}บาท<br />
                  <button className="del"onClick={() => removeFromCard(product.id)}>ลบ</button>
                </p>
              </div>
            ))}

            {/* เลือกคูปอง */}
            <div>
              <label>เลือกคูปอง:</label>
              <select value={coupon} onChange={applyCoupon}>
                <option value="">ไม่มีคูปอง</option>
                <option value="20PERCENT">ส่วนลด 20%</option>
                <option value="SAVE20">ลด 20 บาท</option>
                <option value="FREESHIP">จัดส่งฟรี</option>
              </select>
            </div>

            {/* แสดงราคารวมของสินค้าทั้งหมด */}
            <p>ค่าส่ง:{'  '+shippingCost+'  '}บาท<br/>
              ราคารวมทั้งหมด:{'  '+calculateTotal()+'  '}บาท</p>

            {/* แสดงปุ่มยืนยันการสั่งซื้อ */}
            <button onClick={confirmOrder} style={{ marginTop: '20px' }}>
              ยืนยันการสั่งซื้อ
            </button>
          </div>
        )}

        {/* แสดงข้อความเมื่อการสั่งซื้อได้รับการยืนยัน */}
        {isOrderConfirmed && <p style={{ color: 'green' }}>การสั่งซื้อได้รับการยืนยันแล้ว</p>}
      </div>

      <h1>Mobile phone shop</h1>
      <ul>{listItems}</ul>
    </article>
  );
}

