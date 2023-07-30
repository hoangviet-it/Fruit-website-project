import React, {useContext} from 'react';
import {Switch, Route} from 'react-router-dom';
import Products from './products/Products';
import DetailProduct from './detailproduct/DetailProduct';
import Login from './auth/Login';
import Register from './auth/Register';
import Cart from './cart/Cart';
import NotFound from './utils/not_found/NotFound';
import CreateProduct from './createProduct/CreateProduct';
import CreateOrder from './creatOrder/CreateOrder';
import HomePage from './homePage/HomePage';
import MyOrder from './myOrder/MyOrder';
import UpdateInforClient from './updateInforClient/UpdateInforClient';
import DiscountPage from './discount/DiscountPage';
import Intro from './intro/Intro';
import Contact from './contact/Contact';
import ControlAd from '../Admin/ControlAd';

import {GlobalState} from '../../GlobalState';

function Pages() {
    const state = useContext(GlobalState)
    const [isLogged] = state.userAPI.isLogged
    const [isAdmin] = state.userAPI.isAdmin

    return (
        <Switch>
            <Route path="/" exact component={isAdmin ? ControlAd : HomePage} />

            <Route path="/product" exact component={Products} />
            <Route path="/detail/:id" exact component={DetailProduct} />
            <Route path="/discountpage" exact component={DiscountPage} />
            <Route path="/intro" exact component={Intro} />
            <Route path="/contact" exact component={Contact} />

            <Route path="/login" exact component={isLogged ? NotFound : Login} />
            <Route path="/register" exact component={isLogged ? NotFound : Register} />

            <Route path="/cart" exact component={Cart} />

            <Route path="/create_product" exact component={isAdmin ? CreateProduct : NotFound} />
            <Route path="/edit_product/:id" exact component={isAdmin ? CreateProduct : NotFound} />
 
            <Route path="/order" exact component={isLogged ? CreateOrder : NotFound} />
            <Route path="/myorder" exact component={isLogged ? MyOrder : NotFound} />
            <Route path="/updateinforclient" exact component={isLogged ? UpdateInforClient : NotFound} />
            
            <Route path="*" exact component={NotFound} />
        </Switch>
    )
}
export default Pages;