<?php

namespace App\Http\Controllers;

use App\Models\Province;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ProvinceController extends Controller
{
    /**
     * Display a listing of provinces (JSON API)
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $provinces = Province::all();

            return response()->json([
                'success' => true,
                'data' => $provinces,
                'message' => 'Provinces retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve provinces',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created province (JSON API)
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:provinces,name'
        ]);

        try {
            $province = Province::create([
                'name' => $validated['name'],
                'user_id' => Auth::id()
            ]);

            return response()->json([
                'success' => true,
                'data' => $province,
                'message' => 'Province created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create province',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified province (JSON API)
     *
     * @param  \App\Models\Province  $province
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Province $province): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $province,
            'message' => 'Province retrieved successfully'
        ]);
    }

    /**
     * Update the specified province (JSON API)
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Province  $province
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Province $province): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:provinces,name,' . $province->id
        ]);

        try {
            $province->update($validated);

            return response()->json([
                'success' => true,
                'data' => $province,
                'message' => 'Province updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update province',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified province (JSON API)
     *
     * @param  \App\Models\Province  $province
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Province $province): JsonResponse
    {
        try {
            $province->delete();

            return response()->json([
                'success' => true,
                'message' => 'Province deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete province',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
