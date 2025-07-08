<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>ډریور چاپ</title>
    <!-- Tell the browser to be responsive to screen width -->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Theme style -->
    <link rel="stylesheet" href="{{ asset('dist/css/adminlte.min.css') }}">
    <!-- iCheck -->


    <!-- bootstrap rtl -->
    <link rel="stylesheet" href="{{ asset('dist/css/bootstrap-rtl.min.css') }}">
    <!-- template rtl version -->
    <link rel="stylesheet" href="{{ asset('dist/css/custom-style.css') }}">

</head>

<body id="body">
    <br>
    <div class="container page">
        <div class="row">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 table-responsive">
                <style>
                    #example tr th,
                    #example tr td {
                        text-align: center;
                    }
                </style>
                <div class="printTable">
                    <table id="tbl" class="table table-condensed    "
                        style="direction: ltr; font-family:sans-serif; font-size:12px;">

                        <tr style="border: none;">
                            <!-- <td colspan="3" style="border: none;">
                                <img src="" alt="انځور" height="110" width="90" style="border: 1px;" />
                            </td> -->
                            <td colspan="15" class="text-center" style="border: none; font-weight: bold;">
                                <span> د افغانســـتان اســـلامي امـــــارت </span>
                                <br>
                                <span>د ترانســــپورټ لـوی ریــاست</span>
                                <br /><span> د ننـــــګـــرهــار ولایت ښـــاروالــي </span>
                                <br /><span> شرکت ترانســـــــپورټي ریکـــــشه راني بـابـا</span>
                            </td>
                        </tr>
                        <tr>
                            <td rowspan="2" style="border: 1px solid;"><span id="mode1">ملاحظات</span></td>
                            <td rowspan="2" style="border: 1px solid;"><span id="mode1">تلیفون نمبر</span></td>
                            <td colspan="3" style="border: 1px solid;"><span id="top1">فعلي استوګنځی</span></td>
                            <td colspan="3" style="border: 1px solid;"><span id="top1">اصلي هستوګنځی</span></td>
                            <td rowspan="2" style="border: 1px solid;"><span id="mode1">دتذکیرې نمبر</span></td>
                            <td rowspan="2" style="border: 1px solid;"><span id="mode1">gender</span></td>
                            <td colspan="3" style="border: 1px solid;"><span id="top1"
                                    class="text-center">شهرت</span></td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid;"><span id="mode1">کلی</span></td>
                            <td style="border: 1px solid;"><span id="mode1">ولسوالی</span></td>
                            <td style="border: 1px solid;"><span id="mode1">ولایت</span></td>
                            <td style="border: 1px solid;"><span id="mode1">کلی</span></td>
                            <td style="border: 1px solid;"><span id="mode1">ولسوالی</span></td>
                            <td style="border: 1px solid;"><span id="mode1">ولایت</span></td>
                            <td style="border: 1px solid;"><span id="mode1">دپلارنوم</span></td>
                            <td style="border: 1px solid;"><span id="mode1">نوم او تخلص</span></td>
                        </tr>
                        @foreach ($print_all_data as $data)
                            <tr>
                                <td width="25" style="border: 1px solid;"><span
                                        id="mode1">{{ $data->description }}</span></td>
                                <td width="25" style="border: 1px solid;"><span
                                        id="mode1">{{ $data->phone_number }}</span></td>
                                <td width="25" style="border: 1px solid;"><span
                                        id="mode1">{{ $data->current_village }}</span></td>
                                <td width="25" style="border: 1px solid;"><span
                                        id="mode1">{{ $data->current_dist_name }}</span></td>
                                <td width="25" style="border: 1px solid;"><span
                                        id="mode1">{{ $data->current_pro_name }}</span></td>
                                <td width="25" style="border: 1px solid;"><span
                                        id="mode1">{{ $data->permenant_village }}</span></td>
                                <td width="25" style="border: 1px solid;"><span
                                        id="mode1">{{ $data->per_dist_name }}</span></td>
                                <td width="25" style="border: 1px solid;"><span
                                        id="mode1">{{ $data->per_provine_name }}</span></td>
                                <td width="25" style="border: 1px solid;"><span
                                        id="mode1">{{ $data->nice_number }}</span></td>
                                <td width="25" style="border: 1px solid;"><span
                                        id="mode1">{{ $data->gender }}</span></td>
                                <td width="25" style="border: 1px solid;"><span
                                        id="mode1">{{ $data->driver_fname }}</span></td>
                                <td width="25" style="border: 1px solid;"><span
                                        id="mode1">{{ $data->drive_name . ' ' . $data->driver_lname }}</span></td>
                            </tr>

                            <tr>
                                <td colspan="22" class="text-right" dir="rtl"
                                    style="font-size: 15px; font-weight: bold;">یو عــــــراده ریکـــشه چــې پلیټ
                                    شــــماره یې ({{ $data->plate_no }} )، انجـــن شمـــاره یـې (
                                    {{ $data->Engine_no }} )،</td>
                            </tr>
                            <tr style="border: none;">
                                <td colspan="22" class="text-right" dir="rtl"
                                    style="font-size: 15px; font-weight: bold;">د شــاســي شمـــاره یـې (
                                    {{ $data->shase_no }}) ده او تکـــسي لــــین مســــیر یــې
                                    ({{ $data->old_address }})
                                    دا دی.</td>
                            </tr>
                            <tr style="border: none;">
                                <td colspan="22" class="text-right" dir="rtl"
                                    style="font-size: 15px; font-weight: bold;">۱ . د تکـــــسي د لـــين مســـیر مطابق
                                    فعالیت کوي.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    @if ($data->dir_number == $data->changed_number)
                                        <input checked="checked" disabled type="checkbox" style="font-size:40px;">
                                </td>
                            @else
                                <input type="checkbox" disabled style="font-size: 40px;">
                        @endif

                        </tr>
                        <tr style="border: none;">
                            <td colspan="22" class="text-right" dir="rtl"
                                style="font-size: 15px; font-weight: bold;">۲. غواړي چې په نوي مسیر کې چې د (
                                {{ $data->changed_address }}

                                ) دی دایمي فعالیت وکړي.
                            </td>
                        </tr>
                        <tr style="border: none;">
                            <td colspan="22" class="text-center"><span
                                    style="font-size: 15px; font-weight: bold;">&nbsp;(&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)&nbsp;</span><span
                                    style="font-size: 15px; font-weight: bold;">د مالک لاسلیک / د ګوتې نښه </span></td>
                        </tr>
                        @endforeach
                    </table>
                </div>
                <button type="button" class="btn btn-md btn-primary" id="print">چاپ کول</button>
                <a href="{{ route('driver.index') }}" class="btn btn-sm btn-danger">واپس</a>

            </div>

        </div>


    </div>



    <!-- jQuery -->
    <script src="{{ asset('plugins/jquery/jquery.min.js') }}"></script>

    <script src="{{ asset('js/jquery.PrintArea.js') }}"></script>



    <script>
        $(document).ready(function() {
            $("#print").click(function() {
                var mode = 'iframe';
                var close = mode == 'popup';
                var options = {
                    mode: mode,
                    popClose: close
                };
                $('div.printTable').printArea(options);
            });
        });
    </script>


</body>

</html>
