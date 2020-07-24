import { BehaviorSubject } from 'rxjs';

export const auth$ = new BehaviorSubject(JSON.parse(window.localStorage.getItem('auth') || false));

export function updateAuth(boolean) {
    if (!boolean) {
        window.localStorage.removeItem('auth');
    }
    else {
        window.localStorage.setItem('auth', boolean);
    }
    auth$.next(boolean);
}

export const cart$ = new BehaviorSubject(JSON.parse(window.localStorage.getItem('cart') || "[]"));

export function updateCart(newCart) {

    if (!newCart) {
        window.localStorage.removeItem('cart');
    }
    else {
        window.localStorage.setItem('cart', JSON.stringify(newCart));
    }
    cart$.next(newCart);
}