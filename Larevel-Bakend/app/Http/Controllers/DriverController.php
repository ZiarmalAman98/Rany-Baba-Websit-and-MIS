<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\Direction;
use App\Models\District;
use App\Models\Driver;
use App\Models\Province;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DriverController extends Controller
{
    public function index()
    {
        $drivers = DB::table('drivers as driver')
            ->join('provinces as province', 'driver.permenant_prov_add', '=', 'province.id')
            ->join('districts as district', 'driver.permenant_dis_add', '=', 'district.id')
            ->join('provinces as pro', 'driver.current_prov_add', '=', 'pro.id')
            ->join('cars as car', 'driver.car_id', '=', 'car.id')
            ->join('districts as dist', 'driver.current_dis_add', '=', 'dist.id')
            ->join('directions as direction', 'car.change_add', '=', 'direction.id')
            ->select(
                'driver.*',
                'province.name as per_provine_name',
                'district.name as per_dist_name',
                'pro.name as current_pro_name',
                'dist.name as current_dist_name',
                'direction.from_add',
                'direction.to_add',
                'direction.direction_number',
                'car.plate_no',
                'car.shase_no',
                'car.Engine_no'
            )->get();

        return response()->json([
            'success' => true,
            'data' => $drivers
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'drive_name' => 'required|min:3',
            'driver_lname' => 'required|min:3',
            'driver_fname' => 'required|min:3',
            'nice_number' => 'required|unique:drivers,nice_number',
            'phone_number' => 'required|unique:drivers,phone_number',
            'gender' => 'required|in:male,female',
            'permenant_prov_add' => 'required|exists:provinces,id',
            'permenant_dis_add' => 'required|exists:districts,id',
            'current_prov_add' => 'required|exists:provinces,id',
            'current_dis_add' => 'required|exists:districts,id',
            'car_id' => 'required|exists:cars,id',
            // Add other required fields
        ]);

        $driver = new Driver();
        $driver->fill($request->all());
        $driver->user_id = Auth::id();
        $driver->save();

        return response()->json([
            'success' => true,
            'message' => 'Driver created successfully',
            'data' => $driver
        ]);
    }

    public function show($id)
    {
        $driver = DB::table('drivers as driver')
            ->join('provinces as province', 'driver.permenant_prov_add', '=', 'province.id')
            ->join('districts as district', 'driver.permenant_dis_add', '=', 'district.id')
            ->join('provinces as pro', 'driver.current_prov_add', '=', 'pro.id')
            ->join('cars as car', 'driver.car_id', '=', 'car.id')
            ->join('districts as dist', 'driver.current_dis_add', '=', 'dist.id')
            ->join('directions as direction', 'car.change_add', '=', 'direction.id')
            ->join('directions as dir', 'car.direction_id', '=', 'dir.id')
            ->select(
                'driver.*',
                'province.name as per_provine_name',
                'district.name as per_dist_name',
                'pro.name as current_pro_name',
                'dist.name as current_dist_name',
                DB::raw("CONCAT(dir.from_add, ' - ', dir.to_add) as old_address"),
                DB::raw("CONCAT(direction.from_add, ' - ', direction.to_add) as changed_address"),
                'car.plate_no',
                'car.shase_no',
                'car.Engine_no'
            )
            ->where('driver.id', $id)
            ->first();

        if (!$driver) {
            return response()->json([
                'success' => false,
                'message' => 'Driver not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $driver
        ]);
    }

    public function update(Request $request, $id)
    {
        $driver = Driver::find($id);
        if (!$driver) {
            return response()->json([
                'success' => false,
                'message' => 'Driver not found'
            ], 404);
        }

        $driver->fill($request->all());
        $driver->user_id = Auth::id();
        $driver->save();

        return response()->json([
            'success' => true,
            'message' => 'Driver updated successfully',
            'data' => $driver
        ]);
    }

    public function destroy($id)
    {
        $driver = Driver::find($id);
        if (!$driver) {
            return response()->json([
                'success' => false,
                'message' => 'Driver not found'
            ], 404);
        }

        try {
            $driver->delete();
            return response()->json([
                'success' => true,
                'message' => 'Driver deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete driver',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
