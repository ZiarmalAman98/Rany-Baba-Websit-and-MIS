<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\Direction;
use App\Models\Owner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;


class CarController extends Controller
{
    public function index()
    {
        try {
            $cars = DB::table('owners as owner')
                ->join('cars as car', 'owner.id', 'car.owner_id')
                ->join('directions as direction', 'car.direction_id', 'direction.id')
                ->join('directions as dir', 'car.change_add', 'dir.id')
                ->join('provinces as province', 'owner.permenant_prov_add', 'province.id')
                ->join('districts as district', 'owner.permenant_dist_add', 'district.id')
                ->join('provinces as pro', 'owner.current_prov_add', 'pro.id')
                ->join('districts as dist', 'owner.current_dist_add', 'dist.id')
                ->select(DB::raw('
                    car.id,
                    owner.description as owner_description,
                    owner.name as owner_name,
                    owner.last_name,
                    owner.grand_fname,
                    car.Engine_no as engine_no,
                    direction.from_add,
                    direction.to_add,
                    car.shase_no,
                    car.plate_no,
                    owner.father_name,
                    owner.permenant_village,
                    owner.current_village,
                    owner.owner_job,
                    owner.nic_number,
                    owner.phone_number as phone,
                    owner.image,
                    owner.job_place,
                    province.name as per_provine_name,
                    pro.name as current_pro_name,
                    district.name as per_dist_name,
                    dist.name as current_dist_name,
                    car.company_name as model,
                    car.create_date,
                    car.oil_type,
                    dir.from_add as change_address,
                    dir.to_add as change_to_address,
                    car.car_color as color,
                    car.create_county,
                    car.sale_date,
                    car.saler_info,
                    car.description as car_discription
                '))->get();

            return response()->json([
                'success' => true,
                'data' => $cars
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'د موټرو ترلاسه کولو کې ستونزه پېښه شوه.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            // ... keep your existing validation rules ...
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $carData = [
                'plate_no' => $request->plate_no,
                'company_name' => $request->company_name,
                'create_date' => $request->created_date,
                'direction_id' => $request->direction_id,
                'shase_no' => $request->shase_no,
                'Engine_no' => $request->Engine_no,
                'oil_type' => $request->oil_type,
                'car_color' => $request->car_color,
                'create_county' => $request->created_country,
                'sale_date' => $request->sale_date,
                'saler_info' => $request->saler_info,
                'change_add' => $request->change_add,
                'owner_id' => $request->owner_code,
                'description' => $request->description,
                'user_id' => auth()->id(), // This must come from authenticated user
                'created_at' => now(),
                'updated_at' => now()
            ];

            // Remove any non-existent columns from the array
            // $carData = array_filter($carData); // Optional: remove null values

            $id = DB::table('cars')->insertGetId($carData);
            $car = Car::find($id);

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $car,
                'message' => 'Car registered successfully'
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Database error: ' . $e->getMessage(),
                'error_details' => [
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'trace' => $e->getTraceAsString()
                ]
            ], 500);
        }
    }



    public function show($id)
    {
        try {
            $carData = DB::table('owners as owner')
                ->join('cars as car', 'owner.id', 'car.owner_id')
                ->join('directions as direction', 'car.direction_id', 'direction.id')
                ->join('directions as dir', 'car.change_add', 'dir.id')
                ->join('provinces as province', 'owner.permenant_prov_add', 'province.id')
                ->join('districts as district', 'owner.permenant_dist_add', 'district.id')
                ->join('provinces as pro', 'owner.current_prov_add', 'pro.id')
                ->join('districts as dist', 'owner.current_dist_add', 'dist.id')
                ->select(DB::raw('
                    car.id,
                    owner.description as owner_description,
                    owner.name as owner_name,
                    owner.last_name,
                    owner.grand_fname,
                    car.Engine_no as engine_no,
                    direction.from_add,
                    direction.to_add,
                    car.shase_no,
                    car.plate_no,
                    owner.father_name,
                    owner.permenant_village,
                    owner.current_village,
                    owner.owner_job,
                    owner.nic_number,
                    owner.phone_number as phone,
                    owner.image,
                    owner.job_place,
                    province.name as per_provine_name,
                    pro.name as current_pro_name,
                    district.name as per_dist_name,
                    dist.name as current_dist_name,
                    car.company_name as model,
                    car.create_date,
                    car.oil_type,
                    dir.from_add as change_address,
                    dir.to_add as change_to_address,
                    car.car_color as color,
                    car.create_county,
                    car.sale_date,
                    car.saler_info,
                    car.description as car_discription
                '))
                ->where('car.id', $id)
                ->first();

            if ($carData) {
                return response()->json([
                    'success' => true,
                    'data' => $carData
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'موټر ونه موندل شو.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'د موټر معلومات ترلاسه نه شول.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'plate_no' => 'required|unique:cars,plate_no,' . $id,
            'company_name' => 'required',
            'created_date' => 'required|date',
            'direction_id' => 'required|exists:directions,id',
            'shase_no' => 'required|unique:cars,shase_no,' . $id,
            'Engine_no' => 'required|unique:cars,Engine_no,' . $id,
            'oil_type' => 'required',
            'car_color' => 'required',
            'created_country' => 'required',
            'sale_date' => 'nullable|date',
            'owner_code' => 'required|exists:owners,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $car = Car::findOrFail($id);
            $car->update([
                'plate_no' => $request->plate_no,
                'company_name' => $request->company_name,
                'create_date' => $request->created_date,
                'direction_id' => $request->direction_id,
                'shase_no' => $request->shase_no,
                'Engine_no' => $request->Engine_no,
                'oil_type' => $request->oil_type,
                'car_color' => $request->car_color,
                'create_county' => $request->created_country,
                'sale_date' => $request->sale_date,
                'saler_info' => $request->saler_info,
                'change_add' => $request->change_add,
                'owner_id' => $request->owner_code,
                'description' => $request->description
            ]);

            return response()->json([
                'success' => true,
                'message' => 'د موټر معلومات بریالي ډول سره نوي شول.',
                'data' => $car
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'د موټر معلومات نوي نه شول.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function edit($id)
    {
        try {
            // Get the car data
            $car = Car::findOrFail($id);

            // Get the owner info
            $owner = Owner::find($car->owner_id);

            // Get all directions for the dropdown
            $directions = Direction::all();

            return response()->json([
                'success' => true,
                'edit_car' => $car,
                'owner_name' => $owner,
                'directions' => $directions
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'د موټر د معلوماتو ترلاسه کولو کې ستونزه پېښه شوه.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $car = Car::findOrFail($id);
            $car->delete();

            return response()->json([
                'success' => true,
                'message' => 'موټر په بریالیتوب سره پاک شو.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'موټر نه شو پاکېدای.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function find_owner(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'owner_code' => 'required|exists:owners,id'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'مالک ونه موندل شو.'
                ], 404);
            }

            $owner = Owner::find($request->owner_code);
            $data = $owner->name . "  -  ولد - " . $owner->father_name;

            return response()->json([
                'success' => true,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'د مالک معلومات ترلاسه نه شول.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function get_direction(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'car_id' => 'required|exists:cars,id'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'موټر ونه موندل شو.'
                ], 404);
            }

            $direction = DB::table("cars as car")
                ->join('directions as direction', 'car.change_add', 'direction.id')
                ->select(DB::raw('direction.from_add,direction.to_add,direction.direction_number'))
                ->where('car.id', $request->car_id)
                ->first();

            if ($direction) {
                $data = $direction->from_add . " څخه " . $direction->to_add;

                return response()->json([
                    'success' => true,
                    'data' => $data
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'مسیر ونه موندل شو.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'مسیر ترلاسه نه شو.',
                'error' => $e->getMessage()
            ], 500);
        }
    }



    // CarController.php
    public function getCarByPaletNo(Request $request, $plateNo)
    {
        // Search for the car with full relationships
        $car = Car::with([
            'owner:id,name,last_name,phone_number,nic_number',
            'direction:id,direction_number,from_add,to_add' // Adjust fields based on your Direction model
        ])
            ->where('plate_no', 'LIKE', '%' . $plateNo . '%')
            ->first();

        if (!$car) {
            return response()->json([
                'message' => 'Car not found',
                'data' => null
            ], 404);
        }

        // Format the response with all needed information
        $response = [
            'car' => [
                'plate_no' => $car->plate_no,
                'company_name' => $car->company_name,
                'color' => $car->car_color,
                'shase_no' => $car->shase_no,
            ],
            'owner' => $car->owner ? [
                'full_name' => trim($car->owner->name . ' ' . $car->owner->last_name),
                'contact' => $car->owner->phone_number,
                'nic_number' => $car->owner->nic_number
            ] : null,
            'direction' => $car->direction ? [
                'direction_no' => $car->direction->direction_number,
                'from' => $car->direction->from_add,
                'to' => $car->direction->to_add
            ] : null
        ];

        return response()->json([
            'message' => 'Car found',
            'data' => $response
        ]);
    }
}
