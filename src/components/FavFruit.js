import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { withAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { Card, Button } from "react-bootstrap";
import ModalUpdate from "./ModalUpdate";
const REACT_APP_SERVER = process.env.REACT_APP_SERVER;

class FavFruit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: this.props.auth0.user.name,
      email: this.props.auth0.user.email,
      FruitArray: [],
      updateShow: false,
      select_id:{}
    };
  }
  componentDidMount = () => {
    // to render fav card from data base to profile page
    axios
      .get(`${REACT_APP_SERVER}/fruits/${this.state.email}`)
      .then((foundFruit) => {
        this.setState({
          FruitArray: foundFruit.data,
        });
      });
  };

  deleteItem = (id) => {
    axios.delete(`${REACT_APP_SERVER}/fruits/${id}`).then((deletedItem) => {
      if (deletedItem.data.deletedCount === 1) {
        const newFruitArr = this.state.FruitArray.filter(
          (fruit) => fruit._id !== id
        );
        this.setState({
          FruitArray: newFruitArr,
        });
      }
    });
  };

  showModal = (id) => {
    this.setState({
      updateShow: true,
      select_id:id,
    });
  };

  closeModal = () => {
    this.setState({
      updateShow: false,
    });
  };

  updateFruits=(e)=>{
e.preventDefault();
const regBody={
title:e.target.title.value,
price:e.target.price.value,
img:e.target.img.value,

}

axios.put(`${REACT_APP_SERVER}/fruits/${this.state.select_id}`,regBody).then((updadet)=>{
  window.location.reload();
})

  }

  render() {
    return (
      <>
        <h1>{`Welcome back ${this.state.userName}`}</h1>
        <h1>{` ${this.state.email}`}</h1>

        <h1>My Favorite Fruits</h1>
        {this.state.FruitArray.length &&
          this.state.FruitArray.map((fruit) => {
            return (
              <Card style={{ width: "18rem" }}>
                <Card.Img variant="top" src={fruit.img} />
                <Card.Body>
                  <Card.Title>{fruit.title}</Card.Title>
                  <Card.Text>{fruit.price}</Card.Text>
                  <Button
                    variant="danger"
                    onClick={() => {
                      this.deleteItem(fruit._id);
                    }}
                  >
                    Remove
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      this.showModal(fruit._id);
                    }}
                  >
                    <ModalUpdate
                      fruit={fruit}
                      show={this.state.updateShow}
                      onHide={this.state.closeModal}
                      updateFruits={this.updateFruits}
                    />
                    Update
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
      </>
    );
  }
}

export default withAuth0(FavFruit);
