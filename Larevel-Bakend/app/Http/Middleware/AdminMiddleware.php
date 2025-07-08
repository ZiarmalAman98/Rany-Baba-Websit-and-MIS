<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!empty(Auth::check())) {
            if (Auth::user()->status == 1) {
                return $next($request);
            } else {
                Auth::logout();
                return back()->with('msg', 'نوموړی کارمند غیر فعاله دی !');
            }
        } else {
            Auth::logout();
            return back()->with('msg', 'مهرباني وکړئ، خپل یوزر نوم او اایمل مو داخل کړئ');
        }
        // return $next($request);
    }
}
