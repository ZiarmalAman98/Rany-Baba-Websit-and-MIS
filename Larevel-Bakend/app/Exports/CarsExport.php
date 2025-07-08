<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class CarsExport implements FromCollection, WithHeadings
{
    protected $filters;

    public function __construct(array $filters)
    {
        $this->filters = $filters;
    }

    public function collection()
    {
        $query = \App\Models\Car::query();

        // Apply the same filters as ReportController
        if (!empty($this->filters['filters'])) {
            foreach ($this->filters['filters'] as $field => $value) {
                if (!empty($value)) {
                    $query->where($field, $value);
                }
            }
        }

        // Apply date range
        $now = now();
        switch ($this->filters['time_range']) {
            case 'yearly':
                $query->whereYear('created_at', $now->year);
                break;
            case 'monthly':
                $query->whereYear('created_at', $now->year)
                    ->whereMonth('created_at', $now->month);
                break;
            case 'daily':
                $query->whereDate('created_at', $now->toDateString());
                break;
            case 'custom':
                $query->whereBetween('created_at', [
                    $this->filters['start_date'] . ' 00:00:00',
                    $this->filters['end_date'] . ' 23:59:59'
                ]);
                break;
        }

        return $query->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Make',
            'Model',
            'Color',
            'Year',
            'Price',
            'Status',
            'Created At',
            'Updated At'
        ];
    }
}
