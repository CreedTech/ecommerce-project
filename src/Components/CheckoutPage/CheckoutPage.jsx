import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import useScrollOnMount from 'src/Hooks/App/useScrollOnMount';
import useFormData from 'src/Hooks/Helper/useFormData';
import PagesHistory from '../Shared/MiniComponents/PagesHistory/PagesHistory';
import BillingDetails from './BillingDetails/BillingDetails';
import s from './CheckoutPage.module.scss';
import PaymentSection from './PaymentSection/PaymentSection';
import { showAlert } from 'src/Features/globalSlice';
import { useState } from 'react';
import FadeInOutLoading from '../Shared/Loaders/spinnerLoading';
import { setEmptyArrays } from "src/Features/productsSlice";
import { useNavigate } from "react-router-dom";


const CheckoutPage = () => {
  useScrollOnMount(160);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const [loading, setLoading] = useState(false);
  const { saveBillingInfoToLocal } = useSelector((state) => state.products);
  const { values: billingValues, handleChange } = useFormData({
    initialValues: {
      firstName: '',
      companyName: '',
      address: '',
      streetAddress: '',
      cityOrTown: '',
      phoneNumber: '',
      email: '',
    },
    onSubmit: handleSubmitPayment,
    storeInLocalStorage: saveBillingInfoToLocal,
    localStorageKey: 'billingInfo',
  });

  const pageHistory = [t('history.account'), t('history.checkout')];
  const historyPaths = [
    {
      index: 0,
      path: '/profile',
    },
  ];

  function handleSubmitPayment(e) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    if (!saveBillingInfoToLocal) localStorage.removeItem('billingInfo');
    setTimeout(() => {
      orderCompletionAlert(dispatch, t);
      setLoading(false);
      const arraysToEmpty = ['cartProducts'];
      const emptyArraysAction = setEmptyArrays({ keys: arraysToEmpty });
  
      dispatch(emptyArraysAction);
  
      navigateTo("/feedback");
    }, 3000);
   
    // removeFromCart();
  }

  function removeFromCart() {
    const arraysToEmpty = ['cartProducts'];
    const emptyArraysAction = setEmptyArrays({ keys: arraysToEmpty });

    dispatch(emptyArraysAction);
  }

  return (
    <>
      <Helmet>
        <title>Checkout</title>
        <meta
          name="description"
          content="Complete your purchase on Dales by reviewing your cart, adding your shipping details, and choosing payment options such as cash or bank card for a smooth checkout experience."
        />
      </Helmet>

      <div className="container">
        <main className={s.checkoutPage} id="checkout-page">
          <PagesHistory history={pageHistory} historyPaths={historyPaths} />
          {/* <FadeInOutLoading /> */}
          <form
            method="POST"
            className={s.checkoutPageContent}
            onSubmit={handleSubmitPayment}
          >
            <BillingDetails inputsData={{ billingValues, handleChange }} />
            {!loading && <PaymentSection />}
            {loading && <FadeInOutLoading />}
          </form>
        </main>
      </div>
    </>
  );
};
export default CheckoutPage;

function orderCompletionAlert(dispatch, t) {
  const alertText = 'Your order is on its way!';
  const alertState = 'success';

  setTimeout(() => dispatch(showAlert({ alertText, alertState })), 1500);
}
