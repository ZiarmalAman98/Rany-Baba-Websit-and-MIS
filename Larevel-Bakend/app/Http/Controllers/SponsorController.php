<?php

namespace App\Http\Controllers;

use App\Models\District;
use App\Models\Province;
use App\Models\Sponsor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log; // Add this line

class SponsorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // Basic logging


    // For your specific case in the index method:
    public function index()
    {
        try {
            $sponsors = Sponsor::with([
                'owner:id,name,last_name,father_name',
                'permanentProvince:id,name',
                'permanentDistrict:id,name',
                'currentProvince:id,name',
                'currentDistrict:id,name'
            ])->get();

            return response()->json([
                'success' => true,
                'data' => $sponsors,
                'message' => 'Sponsors retrieved successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('SponsorController index error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve sponsors',
                'error' => env('APP_DEBUG') ? $e->getMessage() : 'Server error'
            ], 500);
        }
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Log::info("DAAAATAA: ", $request->all());

        try {
            // Validate with consistent field names

            $request->merge([
                'permenant_prov_add' => (int)$request->permenant_prov_add,
                'permenant_dis_add' => (int)$request->permenant_dis_add,
                'current_prov_add' => (int)$request->current_prov_add,
                'current_dis_add' => (int)$request->current_dis_add,
                'owner_id' => (int)$request->owner_id
            ]);

            $validated = Validator::make($request->all(), [
                'owner_id' => 'required|exists:owners,id',
                'sponser_name' => 'required|string', // Match DB
                'sponsor_fname' => 'required|string',
                'phone_number' => 'required|string|unique:sponsors,phone_number',
                'permenant_prov_add' => 'required|exists:provinces,id', // Match DB
                'permenant_dis_add' => 'required|exists:districts,id',
                'current_prov_add' => 'required|exists:provinces,id',
                'current_dis_add' => 'required|exists:districts,id',
                'approval_barharli' => 'required|max:255',
                'gender' => 'required',
                'sponsor_image' => 'nullable|sometimes|image|max:2048',
                'current_village' => "required",
                'permenant_village' => "required",
            ])->validate();

            // Add user_id
            $validated['user_id'] = Auth::id();
            if (!$validated['user_id']) {
                throw new \Exception("Authentication required");
            }

            // Handle file upload
            if ($request->hasFile('sponsor_image')) {
                $uploadPath = public_path('upload/sponsor');
                if (!File::exists($uploadPath)) {
                    File::makeDirectory($uploadPath, 0755, true);
                }

                $image = $request->file('sponsor_image');
                $imageName = time() . '.' . $image->getClientOriginalExtension();
                $image->move($uploadPath, $imageName);
                $validated['sponsor_image'] = $imageName;
            }

            // Create sponsor
            // $sponsor = Sponsor::create($validated);

            $sponsor = Sponsor::create([
                'sponser_name' => $validated['sponser_name'],
                'sponsor_fname' => $validated['sponsor_fname'],
                'phone_number' => $validated['phone_number'],
                'permenant_prov_add' => $validated['permenant_prov_add'],
                'permenant_dis_add' => $validated['permenant_dis_add'],
                'current_prov_add' => $validated['current_prov_add'],
                'current_dis_add' => $validated['current_dis_add'],
                'approval_barharli' => $validated['approval_barharli'],
                'gender' => $validated['gender'],
                'current_village' => $validated['current_village'],
                'permenant_village' => $validated['permenant_village'],
                'user_id' => Auth::id(),
                'owner_id' => $validated['owner_id'],
                'sponsor_image' => $validated['sponsor_image'] ?? null, // <-- Add this line
            ]);


            return response()->json([
                'success' => true,
                'data' => $sponsor,
                'message' => 'Sponsor created successfully.'
            ]);
        } catch (\Exception $e) {
            Log::error('Sponsor store error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to create sponsor',
                'error' => env('APP_DEBUG') ? $e->getMessage() : 'Server error'
            ], 500);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $sponsor = Sponsor::with(['permanentProvince', 'permanentDistrict', 'currentProvince', 'currentDistrict', 'owner'])
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $sponsor,
                'message' => 'Sponsor retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Sponsor not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $sponsor = Sponsor::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'sponsor_name' => 'sometimes|min:3',
                'sponsor_fname' => 'sometimes|min:3',
                'phone_number' => 'sometimes|min:10|max:13|unique:sponsors,phone_number,' . $id,
                'approval_barharli' => 'sometimes|max:255',
                'gender' => 'sometimes|in:male,female,other',
                'permenant_prov_add' => 'sometimes|exists:provinces,id',
                'permenant_dis_add' => 'sometimes|exists:districts,id',
                'current_prov_add' => 'sometimes|exists:provinces,id',
                'current_dis_add' => 'sometimes|exists:districts,id',
                'sponsor_image' => 'nullable|image|max:2048',
                'owner_code' => 'sometimes|exists:owners,id'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $request->only([
                'sponsor_name',
                'sponsor_fname',
                'permenant_prov_add',
                'permenant_dis_add',
                'permenant_village',
                'current_prov_add',
                'current_dis_add',
                'current_village',
                'phone_number',
                'approval_barharli',
                'gender'
            ]);

            if ($request->has('owner_code')) {
                $data['owner_id'] = $request->owner_code;
            }

            if ($request->hasFile('sponsor_image')) {
                // Delete old image if exists
                if ($sponsor->sponsor_image) {
                    @unlink(public_path('upload/sponsor/' . $sponsor->sponsor_image));
                }

                $file = $request->file('sponsor_image');
                $extension = $file->getClientOriginalExtension();
                $filename = Str::random(20) . '.' . $extension;
                $file->move('upload/sponsor/', $filename);
                $data['sponsor_image'] = $filename;
            }

            $sponsor->update($data);

            return response()->json([
                'success' => true,
                'data' => $sponsor,
                'message' => 'Sponsor updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update sponsor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $sponsor = Sponsor::findOrFail($id);

            // Delete associated image
            if ($sponsor->sponsor_image) {
                @unlink(public_path('upload/sponsor/' . $sponsor->sponsor_image));
            }

            $sponsor->delete();

            return response()->json([
                'success' => true,
                'message' => 'Sponsor deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete sponsor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get provinces for dropdown
     */
    public function getProvinces()
    {
        try {
            $provinces = Province::all();
            return response()->json([
                'success' => true,
                'data' => $provinces
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch provinces'
            ], 500);
        }
    }

    /**
     * Get districts by province
     */
    public function getDistricts($provinceId)
    {
        try {
            $districts = District::where('province_id', $provinceId)->get();
            return response()->json([
                'success' => true,
                'data' => $districts
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch districts'
            ], 500);
        }
    }

    /**
     * Get owner information
     */
    public function getOwner($id)
    {
        try {
            $owner = DB::table('owners')
                ->where('id', $id)
                ->first();

            if (!$owner) {
                return response()->json([
                    'success' => false,
                    'message' => 'Owner not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $owner
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch owner',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
