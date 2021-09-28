import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// import { Auth0Provider } from "@auth0/auth0-react";
import axios from "axios";
import { withAuth0 } from "@auth0/auth0-react";
import { Card, Button } from "react-bootstrap";
const REACT_APP_SERVER = process.env.REACT_APP_SERVER;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      FruitArray: [],
      email: this.props.auth0.user.email,
    };
  }

  componentDidMount = () => { // to render all card from api to home page
    axios.get(`${REACT_APP_SERVER}/fruits`).then((foundFruit) => {
      console.log(foundFruit.data);
      this.setState({
        FruitArray: foundFruit.data,
      });
    });
  };

  addTofav = (title, price, img) => { // to add card from home page to data base
    const reqBody = {
      title: title,
      price: price,
      img: img,
      email: this.state.email,
    };
    axios.post(`${REACT_APP_SERVER}/fruits`,reqBody).then((creatnewFruit)=>{
      console.log(creatnewFruit);
    })
  };

  render() {
    return (
      <>
        <h1>API Fruits</h1>

        {this.state.FruitArray.map((fruit) => {
          return (
            <Card style={{ width: "18rem" }}>
              <Card.Img variant="top" src={fruit.image} />
              <Card.Body>
                <Card.Title>{fruit.name}</Card.Title>
                <Card.Text>{fruit.price}</Card.Text>
                <Button variant="primary"
                onClick ={()=>{
                  this.addTofav(
                  fruit.name,
                  fruit.image,
                  fruit.price
                  
                  )
                }}
                >Add to Favorite
                </Button>
              </Card.Body>
            </Card>
          );
        })}
      </>
    );
  }
}

export default withAuth0(Home);
