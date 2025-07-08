<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Car;
use App\Models\Owner;
use App\Models\Driver;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function getFilterOptions()
    {
        try {
            // Get all distinct colors and models for dropdowns
            $colors = Car::select('car_color as value')
                ->distinct()
                ->orderBy('value')
                ->get();

            $models = Car::select('company_name as value')
                ->distinct()
                ->orderBy('value')
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'colors' => $colors,
                    'models' => $models
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch filter options',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function generateReport(Request $request)
    {
        $validated = $this->validateRequest($request);

        try {
            // Query cars with filters
            $carQuery = Car::query();
            $this->applyCarFilters($carQuery, $validated);
            $this->applyDateRange($carQuery, $validated);
            $cars = $carQuery->get();

            // Query owners with date filter
            $ownerQuery = Owner::query();
            $this->applyDateRange($ownerQuery, $validated, 'created_at');
            $owners = $ownerQuery->get();

            // Query drivers with date filter
            $driverQuery = Driver::query();
            $this->applyDateRange($driverQuery, $validated, 'created_at');
            $drivers = $driverQuery->get();

            // Get counts
            $counts = [
                'cars' => $cars->count(),
                'owners' => $owners->count(),
                'drivers' => $drivers->count()
            ];

            // Format response based on report type
            $response = [
                'type' => $validated['report_type'],
                'counts' => $counts,
                'data' => $this->formatData($validated['report_type'], $cars)
            ];

            return response()->json([
                'success' => true,
                'data' => $response
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate report',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    protected function validateRequest(Request $request)
    {
        return $request->validate([
            'report_type' => 'required|in:summary,detailed,graphical',
            'time_range' => 'required|in:yearly,monthly,daily,custom',
            'start_date' => 'nullable|date|required_if:time_range,custom',
            'end_date' => 'nullable|date|after_or_equal:start_date|required_if:time_range,custom',
            'color' => 'nullable|string',
            'model' => 'nullable|string'
        ]);
    }

    protected function applyCarFilters($query, $filters)
    {
        if (!empty($filters['color'])) {
            $query->where('car_color', $filters['color']);
        }

        if (!empty($filters['model'])) {
            $query->where('company_name', $filters['model']);
        }
    }

    protected function applyDateRange($query, $filters, $dateColumn = 'created_at')
    {
        $now = Carbon::now();

        switch ($filters['time_range']) {
            case 'yearly':
                $query->whereYear($dateColumn, $now->year);
                break;
            case 'monthly':
                $query->whereYear($dateColumn, $now->year)
                    ->whereMonth($dateColumn, $now->month);
                break;
            case 'daily':
                $query->whereDate($dateColumn, $now->toDateString());
                break;
            case 'custom':
                $query->whereBetween($dateColumn, [
                    Carbon::parse($filters['start_date'])->startOfDay(),
                    Carbon::parse($filters['end_date'])->endOfDay()
                ]);
                break;
        }
    }

    protected function formatData($type, $cars)
    {
        switch ($type) {
            case 'summary':
                return [
                    'by_color' => $cars->groupBy('car_color')->map->count(),
                    'by_model' => $cars->groupBy('company_name')->map->count()
                ];

            case 'detailed':
                return $cars->map(function ($car) {
                    return [
                        'id' => $car->id,
                        'plate_no' => $car->plate_no,
                        'model' => $car->company_name,
                        'color' => $car->car_color,
                        'engine_no' => $car->Engine_no,
                        'shase_no' => $car->shase_no,
                        'created_at' => $car->created_at->format('Y-m-d')
                    ];
                });

            case 'graphical':
                return [
                    'colors' => $cars->groupBy('car_color')->map->count(),
                    'models' => $cars->groupBy('company_name')->map->count(),
                    'monthly' => $cars->groupBy(function ($car) {
                        return $car->created_at->format('Y-m');
                    })->map->count()
                ];
        }
    }
}
