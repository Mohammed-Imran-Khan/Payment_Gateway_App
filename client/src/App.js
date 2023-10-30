import axios from "axios";
import { useState } from "react";
import "./App.css";

function App() {
  const [books, setBooks] = useState([
    {
      name: "Apple Watch SE (2nd Gen)",
      description: "Smart Watch w/Starlight Aluminium Case.",
      img: "https://m.media-amazon.com/images/I/71YdE55GwjL._SX522_.jpg",
      price: 24999,
    },
    {
      name: "Apple AirPods Pro",
      description: "Active Noise Cancellation reduces unwanted background noise.",
      img: "https://m.media-amazon.com/images/I/61sRKTAfrhL._SX679_.jpg",
      price: 18499,
    },

    {
      name: "Apple iPhone 13 (128GB)",
      description: "6.1-inch (15.5 cm diagonal) Super Retina XDR display.",
      img: "https://m.media-amazon.com/images/I/314Rp+8XKWL._SX342_SY445_.jpg",
      price: 50499,
    }
  ]);

  const initPayment = async (data) => {
    try {
      const response = await axios.post("https://mohammed-imrankhan-payment.onrender.com/api/payment/orders", {
        amount: data.amount,
      });
      const orderId = response.data.data.id;
      const options = {
        key: "rzp_test_QFIqzeKc9MdYW3",
        amount: data.amount,
        currency: data.currency,
        name: data.name,
        description: "Test Transaction",
        image: data.img,
        order_id: orderId,
        handler: async (response) => {
          try {
            const verifyUrl = "/api/payment/verify";
            const { data } = await axios.post(verifyUrl, response);
            console.log(data);
          } catch (error) {
            console.log(error);
          }
        },
        theme: {
          color: "#3399cc",
        },
      };
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.log(error);
    }
  };

  const handlePayment = async (book) => {
    try {
      const response = await axios.post("https://mohammed-imrankhan-payment.onrender.com/api/payment/orders", {
        amount: book.price,
      });
      const orderId = response.data.data.id;
      initPayment({ amount: book.price, currency: "INR", id: orderId, name: book.name, img: book.img });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="App">
      {books.map((book, index) => (
        <div className="book_container" key={index}>
          <img src={book.img} alt="book_img" className="book_img" />
          <p className="book_name">{book.name}</p>
          <p className="book_description">Description: {book.description}</p>
          <p className="book_price">
            Price : <span>&#x20B9; {book.price}</span>
          </p>
          <button onClick={() => handlePayment(book)} className="buy_btn">
            Buy Now
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
