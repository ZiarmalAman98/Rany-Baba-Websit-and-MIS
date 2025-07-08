<?php
// use Illuminate\Http\Request;  // Add this line for Request class
// use App\Http\Controllers\AuthController;
// use App\Http\Controllers\CarController;
// use App\Http\Controllers\DashboardController;
// use App\Http\Controllers\DirectionController;
// use App\Http\Controllers\DistrictController;
// use App\Http\Controllers\DocumentController;
// use App\Http\Controllers\DriverController;
// use App\Http\Controllers\OwnerController;
// use App\Http\Controllers\ProvinceController;
// use App\Http\Controllers\SponsorController;
// use App\Http\Controllers\UserController;
// use App\Http\Controllers\Auth\PasswordResetLinkController;
// use App\Http\Controllers\Auth\NewPasswordController;
// use App\Http\Controllers\QrCodeController;
// use Illuminate\Support\Facades\Route;




// // د لاگ ان لپاره روټونه
// Route::get('login', [AuthController::class, 'showLoginForm'])->name('login');
// Route::post('login', [AuthController::class, 'login']);
// Route::post('logout', [AuthController::class, 'logout']);
// Route::get('logout', [AuthController::class, 'logout'])->name('logout');
// Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

// // د ثبتولو لپاره لارښودونه
// Route::get('register', [AuthController::class, 'showRegistrationForm'])->name('register');
// Route::post('register', [AuthController::class, 'register']);

// // Admin Routes with Correct Middleware
// Route::group(['middleware' => ['auth', 'admin']], function () {
//     Route::get('admin/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');
//     Route::get('/filter', [DashboardController::class, 'filter']);

//     Route::get('ajax/fill_direction', [CarController::class, 'get_direction']);
//     Route::get('ajax/fill_per_district', [OwnerController::class, 'per_district']);
//     Route::get('ajax/fill_cur_district', [OwnerController::class, 'cur_district']);
//     Route::get('ajax/fill_owner', [CarController::class, 'find_owner']);

// });

// // Employee Routes with Correct Middleware
// Route::group(['middleware' => ['auth', 'employee']], function () {
//     Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
// });

// Route::get('/', function () {
//     return view('welcome');
// });

// // Route::get('owner/{id}', [OwnerController::class, 'show'])->name('owner.show');

// Route::get('forgot-password', [\App\Http\Controllers\Auth\ForgotPasswordController::class, 'showLinkRequestForm'])->name('password.request');
// Route::post('forgot-password', [\App\Http\Controllers\Auth\ForgotPasswordController::class, 'sendResetLinkEmail'])->name('password.email');
// Route::get('reset-password/{token}', [\App\Http\Controllers\Auth\ResetPasswordController::class, 'showResetForm'])->name('password.reset');
// Route::post('reset-password', [\App\Http\Controllers\Auth\ResetPasswordController::class, 'reset']);

// Route::get('/qrcode/{id}', [QrCodeController::class, 'generateqrCodePdf'])->name('qrcode');
// Route::get('/rikshaw-location', function () {
//     return view('rikshaw_location');
// });
// Route::get('/location', function () {
//     return view('location');
// });

// // CSRF Cookie Route
// Route::get('/sanctum/csrf-cookie', function (Request $request) {
//     return response()->json(['csrf_token' => csrf_token()]);
// });


// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

// Route::post('/api/login', [AuthController::class, 'apiLogin']);
