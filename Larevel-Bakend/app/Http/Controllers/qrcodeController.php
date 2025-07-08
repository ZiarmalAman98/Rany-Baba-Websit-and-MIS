<?php

namespace App\Http\Controllers;

use App\Models\Car;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class QrCodeController extends Controller
{
    public function generateqrCodePdf($id)
    {
        // Fetch the car with owner and direction data
        $car = Car::with(['owner', 'direction'])
                 ->findOrFail($id);

        // Prepare QR text in Pashto
        $qrText =
            "د موټر معلومات:\n" .
            "پلیټ نمبر: " . $car->plate_no . "\n" .
            "د شرکت نوم: " . $car->company_name . "\n" .
            "رنګ: " . $car->color . "\n" .
            "د چاسی نمبر: " . $car->shase_no . "\n\n" .
            "د مالک معلومات:\n" .
            "نوم: " . $car->owner->full_name . "\n" .
            "د اړیکې نمبر: " . $car->owner->contact . "\n\n" .
            "د لارې معلومات:\n" .
            "د لارې نمبر: " . $car->direction->direction_no . "\n" .
            "څخه: " . $car->direction->from . "\n" .
            "تر: " . $car->direction->to;

        // Generate QR code with UTF-8 encoding
        $qrCode = QrCode::format('svg')
                        ->size(200)
                        ->encoding('UTF-8')
                        ->generate($qrText);

        return view('carQrCode', compact('qrCode', 'car'));
    }
}
