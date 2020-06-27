import React from 'react'; // Need because we will render tsx files here
import { render, fireEvent, wait } from '@testing-library/react'; // this library comes together when we start a react project. Render is a function to render an element from the DOM
import SignIn from '../../pages/SignIn'; // Need to import the page we will test

// starting a funcion that does do nothing, to use it later in this code.
const mockedHistoryPush = jest.fn();
const mockedSignIn = jest.fn();
const mockedAddToast = jest.fn();

// mock is a function that gets the original function and make in the test scenario what we want. We need to use here all the imports of the original page that is used to render what we are testing. Because that, we are using "useHistory" and "Link", in this case, to handle the navigate to another page
jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

// mocking signIn function of useAuth hook, because this test only need to test de showing items, and not the call with API
jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      signIn: mockedSignIn,
    }),
  };
});

// just creating this mock to be used in a test later
jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

describe('SignIn Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear(); // clearing var to use it in each test clean
  });

  it('should be able to sign in', async () => {
    // getting funcions that render() function provide us
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    // getting fields of the renderized DOM
    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    // firing event on this fields. target and value is used because, in the DOM, when we fire an event, to get the value of the field, we use 'event.target.value'
    fireEvent.change(emailField, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });

    fireEvent.click(buttonElement);

    // in the signin page, when login is successful, we are redirected to dashboard
    await wait(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should not be able to sign in with invalid credentials', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: 'not-valid-email' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });

    fireEvent.click(buttonElement);

    // if we insert invalid credentials, we will NOT redirected to dashboard
    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should display and error if login fails', async () => {
    // if SignIn returns a error. A toast must be showed in the screen. So, we mock SignIn function and throw an error
    mockedSignIn.mockImplementation(() => {
      throw new Error();
    });

    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });

    fireEvent.click(buttonElement);

    // if signIn functions returns an error, a toast of type 'error' must be showed on screen
    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'error' }),
      );
    });
  });
});
