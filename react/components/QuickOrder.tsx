import React, { useState, useEffect } from "react";
import { useMutation, useLazyQuery } from "react-apollo";
import UPDATE_CART from "../graphql/updateCart.graphql";
import GET_PRODUCT from "../graphql/getProductBySku.graphql";
import { useCssHandles } from "vtex.css-handles";
import "./styles.css";

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

  const CSS_HANDLES = [
    "container__form",
    "form__input",
    "form__label",
    "container__button",
    "form__input--button"
  ]

  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div className={handles["container__form"]}>
      <form
        onSubmit={searchProduct}
      >
        <div>
          <label htmlFor="sku" className={handles["form__label"]}>Ingresa el número de SKU</label>
          <input id="sku" type="text" onChange={handleChange} className={handles["form__input"]}></input>
        </div>
        <div className={handles["container__button"]}>
          <input type="submit" value="COMPRAR" className={handles["form__input--button"]}/>
        </div>
      </form>
    </div>
  )
}

export default QuickOrder
