<!DOCTYPE html>
<html lang="ps" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css">
    <title>شرکت ترانسپورټي ریکشه راني بـابـا</title>
    <style>
        @font-face {
            font-family: 'Bahij Titra';
            src: url('/fonts/BahijTitra-Regular.ttf') format('truetype');
        }
        body {
            font-family: 'Bahij Titra', sans-serif;
        }
        .qr-container {
            background: white;
            padding: 20px;
            display: inline-block;
            margin: 20px 0;
        }
        @media print {
            body * {
                visibility: hidden;
            }
            .printable, .printable * {
                visibility: visible;
            }
            .printable {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
            }
            .no-print {
                display: none !important;
            }
        }
    </style>
</head>
<body>
    <div class="container printable">
        <center>
            <h2 class="mt-5">د موټر او لارې معلومات سکین کړی</h2>

            <div class="qr-container">
                {!! $qrCode !!}
            </div>

            <div class="text-end mt-4" style="max-width: 500px; margin: 0 auto;">
                <h4>د موټر معلومات:</h4>
                <p><strong>پلیټ نمبر:</strong> {{ $car->plate_no }}</p>
                <p><strong>د شرکت نوم:</strong> {{ $car->company_name }}</p>
                <p><strong>رنګ:</strong> {{ $car->color }}</p>
                <p><strong>د چاسی نمبر:</strong> {{ $car->shase_no }}</p>

                <h4 class="mt-3">د مالک معلومات:</h4>
                <p><strong>نوم:</strong> {{ $car->owner->full_name }}</p>
                <p><strong>د اړیکې نمبر:</strong> {{ $car->owner->contact }}</p>

                <h4 class="mt-3">د لارې معلومات:</h4>
                <p><strong>د لارې نمبر:</strong> {{ $car->direction->direction_no }}</p>
                <p><strong>څخه:</strong> {{ $car->direction->from }}</p>
                <p><strong>تر:</strong> {{ $car->direction->to }}</p>
            </div>

            <div class="no-print mt-4">
                <button class="btn btn-warning" onclick="window.print()">چاپ</button>
            </div>
        </center>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
