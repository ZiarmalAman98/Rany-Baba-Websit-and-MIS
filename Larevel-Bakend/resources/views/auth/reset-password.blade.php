@extends('layouts.app')

@section('content')
    <h2>Reset Password</h2>
    <form method="POST" action="{{ route('password.update') }}">
        @csrf
        <input type="hidden" name="token" value="{{ request()->route('token') }}">
        

        <label>Email Address:</label>
        <input type="email" name="email" required>

        <label>New Password:</label>
        <input type="password" name="password" required>

        <label>Confirm Password:</label>
        <input type="password" name="password_confirmation" required>

        <button type="submit">Reset Password</button>
    </form>
@endsection
