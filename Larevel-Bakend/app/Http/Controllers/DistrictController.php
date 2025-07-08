<?php

namespace App\Http\Controllers;

use App\Models\District;
use App\Models\Province;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class DistrictController extends Controller
{
    /**
     * Display a listing of districts (JSON API)
     */
    // public function index(): JsonResponse
    // {
    //     try {
    //         $districts = District::with('province')
    //             ->orderBy('id', 'desc')
    //             ->get();

    //         return response()->json([
    //             'success' => true,
    //             'data' => $districts,
    //             'message' => 'Districts retrieved successfully'
    //         ]);
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Failed to retrieve districts',
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }

    public function index()
    {
        $districts = District::all(); // یا ستاسو د اړتیا مطابق
        return response()->json([
            'data' => $districts
        ]);
    }


    /**
     * Store a newly created district (JSON API)
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'province_id' => 'required|exists:provinces,id'
        ]);

        try {
            $district = District::create([
                'name' => trim($validated['name']),
                'province_id' => $validated['province_id'],
                'user_id' => Auth::id()
            ]);

            return response()->json([
                'success' => true,
                'data' => $district,
                'message' => 'District created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create district',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified district (JSON API)
     */
    public function show(District $district): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $district->load('province'),
            'message' => 'District retrieved successfully'
        ]);
    }

    /**
     * Update the specified district (JSON API)
     */
    public function update(Request $request, District $district): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'province_id' => 'required|exists:provinces,id'
        ]);

        try {
            $district->update([
                'name' => trim($validated['name']),
                'province_id' => $validated['province_id']
            ]);

            return response()->json([
                'success' => true,
                'data' => $district,
                'message' => 'District updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update district',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified district (JSON API)
     */
    public function destroy(District $district): JsonResponse
    {
        try {
            $district->delete();

            return response()->json([
                'success' => true,
                'message' => 'District deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete district',
                'error' => $e->getMessage()
            ], 500);
        }
    }





    public function getDistrictsByProvinceID($provinceId)
    {

        $districts = District::where('province_id', $provinceId)->get();

        return response()->json($districts);
    }

}
