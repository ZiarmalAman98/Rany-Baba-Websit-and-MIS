<?php


namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\Direction;
use Illuminate\Http\Request;

class CarDirectionController extends Controller
{
public function getCarDirectionsByPlateNo($plateNo)
{
// Find the car by plate_no
$car = Car::where('plate_no', $plateNo)->first();

if (!$car) {
return response()->json(['error' => 'Car not found'], 404);
}

// Get the directions for this car
$directions = Direction::where('car_id', $car->id)->get();

if ($directions->isEmpty()) {
return response()->json(['error' => 'No directions found for this car'], 404);
}

return response()->json(['data' => $directions]);
}
}
