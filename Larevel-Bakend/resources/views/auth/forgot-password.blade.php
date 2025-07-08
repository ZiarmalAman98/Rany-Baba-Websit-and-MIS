@extends('layouts.app')

@section('content')
    <div class="container">
        <h2>Forgot Password</h2>
        <form method="POST" action="{{ route('password.email') }}">
            
            @csrf
            <label>Email:</label>
            <input type="email" name="email" required autofocus>
            <button type="submit">Send Reset Link</button>
        </form>
    </div>
@endsection
