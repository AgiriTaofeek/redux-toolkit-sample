import { Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { showNotification } from './store/ui-slice';
import Cart from './components/Cart/Cart';
import Layout from './components/Layout/Layout';
import Products from './components/Shop/Products';
import Notification from './components/UI/Notification';
import { sendCartData, fetchCartData } from './store/cart-actions';

let isInitial = true;

function App() {
  const dispatch = useDispatch();
  const showCart = useSelector((state) => state.ui.cartIsVisible);
  const cart = useSelector((state) => state.cart);
  const notification = useSelector((state) => state.ui.notification);

  useEffect(() => {
    dispatch(fetchCartData());
  }, [dispatch]);


  //* We face one problem when using useEffect the way we currently do it: It will execute when our app starts. Why is this an issue? It's a problem because this will send the initial (i.e. empty) cart to our backend and overwrite any data stored there.

  // useEffect(() => {
  //   const sendCartData = async () => {
  //     dispatch(
  //       showNotification({
  //         status: 'pending',
  //         title: 'sending...',
  //         message: 'sending cart data',
  //       })
  //     );
  //     const res = await fetch(
  //       'https://react-http-ad96f-default-rtdb.firebaseio.com/cart.json',
  //       {
  //         method: 'PUT',
  //         body: JSON.stringify(cart),
  //       }
  //     );

  //     if (!res.ok) {
  //       throw new Error('Sending cart data failed');
  //     }

  //     const data = await res.json();
  //     console.log(data);
  //     dispatch(
  //       showNotification({
  //         status: 'success',
  //         title: 'Success!',
  //         message: 'sent cart data successfully',
  //       })
  //     );
  //   };

  //   if (isInitial) {
  //     isInitial = false;
  //     return;
  //   }

  //   sendCartData().catch((e) => {
  //     dispatch(
  //       showNotification({
  //         status: 'error',
  //         title: 'Error!',
  //         message: 'sending cart data failed',
  //       })
  //     );
  //   });
  // }, [cart, dispatch]);


  //* The action creators approach which is better

  useEffect(() => {
    if (isInitial) {
      isInitial = false;
      return;
    }

    if (cart.changed) {
      dispatch(sendCartData(cart));
    }
  }, [cart, dispatch]);

  return (
    <Fragment>
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
      <Layout>
        {showCart && <Cart />}
        <Products />
      </Layout>
    </Fragment>
  );
}

export default App;
