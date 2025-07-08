<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CarController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DirectionController;
use App\Http\Controllers\DistrictController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\DriverController;
use App\Http\Controllers\OwnerController;
use App\Http\Controllers\ProvinceController;
use App\Http\Controllers\SponsorController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\QrCodeController;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Http\Controllers\CarDirectionController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\ReportController;

/*
|---------------------------------------------------------------------------
| API Routes
|---------------------------------------------------------------------------
| These API routes work with the React frontend. Sanctum is used for
| token-based authentication.
*/




Route::middleware('auth:api')->prefix('reports')->group(function () {
    Route::get('/filter-options', [ReportController::class, 'getFilterOptions']);
    Route::post('/generate', [ReportController::class, 'generateReport']);
});


// Cars Related Routes

Route::prefix('cars')->group(function () {
    Route::get('/', [CarController::class, 'index']);


    Route::get('/{id}', [CarController::class, 'index']);
    Route::get('/{id}', [CarController::class, 'show']);

    Route::get('/{id}/edit', [CarController::class, 'edit']);

    Route::put('/{id}', [CarController::class, 'update']);

    Route::get('/search/{plateNo}', [CarController::class, 'getCarByPaletNo']);                                                                                 
    Route::post('/find-owner', [CarController::class, 'find_owner']);

    Route::post('/get-direction', [CarController::class, 'get_direction']);
});

Route::middleware('auth:sanctum')->post('/cars', [CarController::class, 'store']);



// Owner Related Routes



Route::prefix('owners')->group(function () {
    Route::get('/', [OwnerController::class, 'index']);

    Route::post('/', [OwnerController::class, 'store'])->middleware('auth:sanctum');

    Route::get('/info', [OwnerController::class, 'getOwnerInfo']);

    Route::get('/{id}', [OwnerController::class, 'show']);

    Route::get('/ownerprint/{id}', [OwnerController::class, 'ownerprint']);

    Route::put('/{id}', [OwnerController::class, 'update']);

    Route::delete('/{id}', [OwnerController::class, 'destroy']);

    Route::get('/max-id', [OwnerController::class, 'getMaxId']);

    Route::get('/by-district', [OwnerController::class, 'per_district']);
    Route::get('/current-district', [OwnerController::class, 'cur_district']);
});



// Province Related Routes


Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('provinces')->group(function () {
        Route::get('/', [ProvinceController::class, 'index']);
        Route::post('/', [ProvinceController::class, 'store']);
        Route::get('/{province}', [ProvinceController::class, 'show']);
        Route::put('/{province}', [ProvinceController::class, 'update']);
        Route::delete('/{province}', [ProvinceController::class, 'destroy']);
    });
});


// District Related Routes


Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('districts')->group(function () {
        Route::get('/', [DistrictController::class, 'index']);
        Route::post('/', [DistrictController::class, 'store']);
        Route::get('/{district}', [DistrictController::class, 'show']);
        Route::put('/{district}', [DistrictController::class, 'update']);
        Route::delete('/{district}', [DistrictController::class, 'destroy']);
        Route::get('/new/{provinceId}', [DistrictController::class, "getDistrictsByProvinceID"]);
    });
});





// Direction Related Rouets


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/directions', [DirectionController::class, 'index']);
    Route::post('/directions', [DirectionController::class, 'store']);
    Route::get('/directions/{id}', [DirectionController::class, 'show']);
    Route::put('/directions/{id}', [DirectionController::class, 'update']);
    Route::delete('/directions/{id}', [DirectionController::class, 'destroy']);
});



// Driver Related Routes


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/drivers', [DriverController::class, 'index']);
    Route::post('/drivers', [DriverController::class, 'store']);
    Route::get('/drivers/{id}', [DriverController::class, 'show']);
    Route::put('/drivers/{id}', [DriverController::class, 'update']);
    Route::delete('/drivers/{id}', [DriverController::class, 'destroy']);
});


Route::get('/provinces/{provinceId}/districts', [DistrictController::class, 'getDistrictsByProvince']);


Route::get('/cars/{plateNo}/directions', [CarDirectionController::class, 'getCarDirectionsByPlateNo']);



// Sponser Related Routes


Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/sponsors', [SponsorController::class, 'index']);
    Route::post('/sponsors', [SponsorController::class, 'store']);
    Route::get('/sponsors/{id}', [SponsorController::class, 'show']);
    Route::put('/sponsors/{id}', [SponsorController::class, 'update']);
    Route::delete('/sponsors/{id}', [SponsorController::class, 'destroy']);

    Route::get('/provinces', [SponsorController::class, 'getProvinces']);
    Route::get('/provinces/{provinceId}/districts', [SponsorController::class, 'getDistricts']);

    Route::get('/owners/{id}', [SponsorController::class, 'getOwner']);
});



// User Related Routes

Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::post('/', [UserController::class, 'store']);
        Route::get('/{id}', [UserController::class, 'show']);
        Route::put('/{id}', [UserController::class, 'update']);
        Route::delete('/{id}', [UserController::class, 'destroy']);
        Route::post('/{id}/block', [UserController::class, 'block']);
    });

    Route::post('/logout', [AuthController::class, 'apiLogout']);
});


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/getUser', [UserController::class, 'getUserBasedOnToken']);
});


// Document Related Routes


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/documents', [DocumentController::class, 'index']);
    Route::post('/documents', [DocumentController::class, 'store']);
    Route::get('/documents/{id}', [DocumentController::class, 'show']);
    Route::delete('/documents/{id}', [DocumentController::class, 'destroy']);
});




Route::post('/register', [AuthController::class, 'register']);
Route::get('/qrcode/{id}', [QrCodeController::class, 'generateqrCodePdf']);
Route::get('/csrf-token', fn(Request $request) => response()->json(['csrf_token' => csrf_token()]));

Route::post('/test-login', [AuthController::class, 'apiLogin']);
Route::post('/test', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required'
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    $token = $user->createToken('RanyBaba')->plainTextToken;

    return response()->json([
        'message' => 'Login successful',
        'token' => $token,
        'user' => $user
    ]);
});




Route::post('forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail']);
Route::post('reset-password', [ResetPasswordController::class, 'reset']);




Route::middleware('auth:sanctum')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/filter', [DashboardController::class, 'filter']);
    Route::get('/count', [DashboardController::class, 'getCount']);
    Route::get('/users/{id}', [UserController::class, 'block']);

    // Route::get('/document/index/{id}', [DocumentController::class, 'index']);
    // Route::post('/document/index', [DocumentController::class, 'store']);
    // Route::get('/document/delete/{id}', [DocumentController::class, 'destroy']);

    Route::get('ajax/fill_direction', [CarController::class, 'get_direction']);
    Route::get('ajax/fill_per_district', [OwnerController::class, 'per_district']);
    Route::get('ajax/fill_cur_district', [OwnerController::class, 'cur_district']);
    Route::get('ajax/fill_owner', [CarController::class, 'find_owner']);

    Route::get('/users/{id}/block', [UserController::class, 'block']);
    Route::get('/users', [UserController::class, 'index']);
    Route::middleware('auth:sanctum')->get('/getUser', [UserController::class, 'getUser']);
    Route::middleware('auth:sanctum')->get('/useUser/{id}', [UserController::class, 'show']);

    // Route::get('/document/{id}', [DocumentController::class, 'index']);
    // Route::post('/document', [DocumentController::class, 'store']);
    // Route::delete('/document/{id}', [DocumentController::class, 'destroy']);

    Route::post('/logout', [AuthController::class, 'apiLogout']);
});
