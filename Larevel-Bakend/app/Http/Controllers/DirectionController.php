<?php

namespace App\Http\Controllers;

use App\Models\Direction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class DirectionController extends Controller
{
    /**
     * Get all directions
     */
    public function index()
    {
        try {
            $directions = Direction::all();
            return response()->json([
                'success' => true,
                'data' => $directions
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch directions',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a new direction
     */
    public function store(Request $request)
    {
        Log::info("DIIIRECTION: ", $request->all());

        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated',
            ], 401);
        }

        $request->validate([
            'direction_number' => 'required|unique:directions,direction_number',
            'from_add' => 'required|string',
            'to_add' => 'required|string',
        ]);

        try {
            $direction = Direction::create([
                'direction_number' => $request->direction_number,
                'from_add' => $request->from_add,
                'to_add' => $request->to_add,
                'user_id' => Auth::id(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Direction created successfully',
                'data' => $direction
            ], 201);
        } catch (\Exception $e) {
            Log::error('Failed to create direction: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to create direction',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * Show a single direction
     */
    public function show($id)
    {
        $direction = Direction::find($id);
        if (!$direction) {
            return response()->json([
                'success' => false,
                'message' => 'Direction not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $direction
        ]);
    }

    /**
     * Update a direction
     */
    public function update(Request $request, $id)
    {
        $direction = Direction::find($id);
        if (!$direction) {
            return response()->json([
                'success' => false,
                'message' => 'Direction not found'
            ], 404);
        }

        $request->validate([
            'direction_number' => 'required|unique:directions,direction_number,' . $direction->id,
            'from_add' => 'required|string|max:255',
            'to_add' => 'required|string|max:255',
        ]);

        try {
            $direction->update([
                'direction_number' => $request->direction_number,
                'from_add' => $request->from_add,
                'to_add' => $request->to_add,
                'user_id' => Auth::id(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Direction updated successfully',
                'data' => $direction
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update direction',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a direction
     */
    public function destroy($id)
    {
        $direction = Direction::find($id);
        if (!$direction) {
            return response()->json([
                'success' => false,
                'message' => 'Direction not found'
            ], 404);
        }

        try {
            $direction->delete();
            return response()->json([
                'success' => true,
                'message' => 'Direction deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete direction',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
