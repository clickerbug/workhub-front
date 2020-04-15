import * as React from "react";
import shortid from "shortid";
// @ts-ignore
import Login from "../../actions/functions/Login.ts";
// @ts-ignore
import {setRememberUser, useGlobalState} from "../../actions/states/Auth.ts";
import { useRouter } from "next/router";

import TextInput from "../../components/forms/TextInput";


const LoginForm: React.FC<React.Props> = () => {
    const router = useRouter();

    const [invalidUsername, setInvalidUsernameState] = React.useState<boolean>(true);
    const [invalidPassword, setInvalidPasswordState] = React.useState<boolean>(true);
    const [invalidCredentials, setInvalidCredentials] = React.useState<boolean>(false);
    const [token, setToken] = useGlobalState('token');

    React.useEffect(() => {
        if(typeof token === "string") { router.push(`/`); }
    });

    function validateInput(input: string): boolean {
        if(input.length < 1)
            return false;
        //@todo more conditions can be added here later
        return true;
    }

    const [rememberUser] = useGlobalState('rememberUser');
    const [userData] = useGlobalState('userData');

    const [isLoading, setLoading] = React.useState<boolean>(false);
    const [errors, setErrors] = React.useState<Array<object>|any>(null);
    const handleLogin: React.ReactEventHandler<HTMLFormElement> = (ev) => {
        ev.preventDefault();
        let username = '';
        if(!userData)
            username = ev.currentTarget['username-email'].value.toLowerCase();
        else
            username = userData.username;
        const password = ev.currentTarget['password'].value;
        setLoading(true);
        setRememberUser(ev.currentTarget['remember-me'].checked);
        if(validateInput(username) && validateInput(password))
            Login({username, password}).then(response => {
                setLoading(false);
                if(response.hasOwnProperty('errors'))
                {
                    setErrors(response.errors);
                    setInvalidCredentials(true);
                }
                else
                    setToken(response.token);
            })
    };

    const renderUsernameInput = () => <div>
       <TextInput
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="email"
            spellCheck="false"
            label="Username or Email Address"
            name="username-email"
            type="text"
            disableSpace
            isRequired
            onValidate={(state) => setInvalidUsernameState(!state)}
        />
    </div>;


    return <div>
        {
            invalidCredentials ?
                <div className="alert alert-danger">
                    {errors.map(e => <span key={shortid.generate()}>{e.message}</span>)}
                </div>
            : null
        }
        {
            !isLoading ?
                <form
                    aria-label="Login Form"
                    title="Login Form"
                    onSubmit={handleLogin}
                >
                    { renderUsernameInput() }
                    <TextInput
                        autoCapitalize="off"
                        autoCorrect="off"
                        autoComplete="password"
                        spellCheck="false"
                        label="Password"
                        name="password"
                        type="password"
                        isRequired
                        onValidate={(state) => setInvalidPasswordState(!state)}
                    />
                    <div className="form-group form-check px-4">
                        <input aria-label="Remember User Details" id="remember-me-checkbox" type="checkbox" className="form-check-input" name="remember-me" />
                        <label className="form-check-label" htmlFor="remember-me-checkbox">Remember Me</label>
                    </div>
                    <button
                        disabled={(invalidUsername || rememberUser === 'true') || invalidPassword}
                        type="submit"
                        className="btn btn-block p-2 font-weight-bold btn-primary"
                    >
                        LOGIN
                    </button>
                </form>
            : <div>Logging you in</div>
        }
    </div>;
};


export default LoginForm;