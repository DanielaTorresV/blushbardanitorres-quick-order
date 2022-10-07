import React, { useState, useEffect } from "react";
import { useMutation, useLazyQuery } from "react-apollo";
import UPDATE_CART from "../graphql/updateCart.graphql"
import GET_PRODUCT from "../graphql/getProductBySku.graphql"

const QuickOrder = () => {
  const [inputText, setInputText] = useState("");
  const [search, setSearch] = useState("")

  const [getProductData, { data: product}] = useLazyQuery(GET_PRODUCT)
  const [addToCart] = useMutation(UPDATE_CART)

  const handleChange = (event: any) => {
    setInputText(event.target.value)
  }

  useEffect(() => {
    if (product) {
      let skuId = parseInt(inputText)
      addToCart({
        variables: {
          salesChannel: "1",
          items: [
            {
              id: skuId,
              quantity: 1,
              seller: "1"
            }
          ]
        }
      })
      .then(() => {
        window.location.href = "/checkout"
      })
    }
  }, [product, search])

  const addProducToCart = () => {
    getProductData({
      variables: {
        sku: inputText
      }
    })
  }

  const searchProduct = (event: any) => {
    event.preventDefault();
    if (!inputText) {
      alert("Ingresa algún valor!!")
    } else {
      setSearch(inputText)
      addProducToCart()
    }
  }

  return (
    <div>
      <form
        onSubmit={searchProduct}
      >
        <div>
          <label htmlFor="sku">Ingresa el número de SKU</label>
          <input id="sku" type="text" onChange={handleChange}></input>
        </div>
        <input type="submit" value="COMPRAR"/>
      </form>
    </div>
  )
}

export default QuickOrder
