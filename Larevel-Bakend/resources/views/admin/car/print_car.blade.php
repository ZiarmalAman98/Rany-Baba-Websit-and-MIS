<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>موټر معلومات چاپ</title>
    <!-- Tell the browser to be responsive to screen width -->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Theme style -->
    <link rel="stylesheet" href="{{ asset('dist/css/adminlte.min.css') }}">
    <!-- iCheck -->
    <link rel="stylesheet" href="{{ asset('plugins/iCheck/square/blue.css') }}">

    <!-- bootstrap rtl -->
    <link rel="stylesheet" href="{{ asset('dist/css/bootstrap-rtl.min.css') }}">
    <!-- template rtl version -->
    <link rel="stylesheet" href="{{ asset('dist/css/custom-style.css') }}">
    <link rel="stylesheet" href="{{ asset('plugins/toastr/toastr.min.css') }}">
</head>

<body>
    <br>
    <div class="container" style="border: 2px;">

        <div class="row" style="text-align:right;">
            <div class=" col-lg-1 col-md-12 col-sm-12">

            </div>
            <div class="col-lg-10 col-md-12 col-sm-12 table-responsive">
                <style>
                    #example tr th,
                    #example tr td {
                        text-align: center;

                    }
                </style>
                <div class="printTable">
                    <table id="tbl" class="table table-condensed "
                        style="direction: ltr; font-family:Bahij Zar; text-align:center">
                        <tr style="border: none;">
                            <!-- <td colspan="3" style="border: none;">
                                <img src="" alt="انځور" height="110" width="90" style="border: 2px;" />
                            </td> -->
                            <td colspan="19" class="text-center" style="border: none; vertical-align: middle;">
                                <span style="font-size: 18px; font-weight: bold;"> د افغانســـتان اســـلامي امـــــارت
                                </span>
                                <br>
                                <span style="font-size: 18px; font-weight: bold;">د ترانســــپورټ لـوی ریــاست</span>
                                <br /><span style="font-size: 18px; font-weight: bold;"> د ننـــــګـــرهــار ولایت
                                    ښـــاروالــي </span>
                                <br /><span style="font-size: 18px; font-weight: bold;"> شرکت ترانســـــــپورټي
                                    ریکـــــشه راني بـابـا</span>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="22" style="border: 2px solid;"><span id="mode1">د نقلیه وسایط د مالک شهرت
                                </span></td>
                        </tr>

                        @foreach ($select_car_owners as $car_owner)
                            <tr>


                                <td colspan="2" style="border:  2px solid;">{{ $car_owner->grand_fname }}</td>
                                <td colspan="" style="border: 2px solid;">دنیکه نوم</td>
                                <td colspan="2" style="border:  2px solid;">{{ $car_owner->father_name }}</td>
                                <td colspan="" style="border: 2px solid;">دپلارنوم</td>
                                <td colspan="2" style="border:  2px solid;">
                                    {{ $car_owner->name . ' ' . $car_owner->last_name }}</td>
                                <td colspan="" style="border:  2px solid;">نوم او تخلص</td>
                            </tr>
                            <tr>
                                <td colspan="22" style="border: 2px solid;"></td>
                            </tr>
                            <tr>
                                <td colspan="4" style="border:  2px solid;">
                                    {{ $car_owner->current_pro_name . ' -  ' . $car_owner->current_dist_name . ' - ' . $car_owner->current_village }}
                                </td>
                                <td colspan="" style="border: 2px solid;">اصلي استوګنځی</td>
                                <td colspan="3" style="border:  2px solid;">
                                    {{ $car_owner->per_provine_name . ' - ' . $car_owner->per_dist_name . ' - ' . $car_owner->permenant_village }}
                                </td>
                                <td colspan="" style="border: 2px solid;">فعلي استوګنځی</td>

                            </tr>
                            <tr>
                                <td colspan="22" style="border: 2px solid;"></td>
                            </tr>
                            <tr>

                                <td colspan="2" style="border:  2px solid;">{{ $car_owner->phone_number }}</td>
                                <td colspan="" style="border: 2px solid;">د اړیګي شماره</td>
                                <td colspan="2" style="border:  2px solid;">{{ $car_owner->nic_number }}</td>
                                <td colspan="" style="border: 2px solid;">د پېژند پاڼي شمیره</td>
                                <td colspan="2" style="border:  2px solid;">
                                    {{ $car_owner->owner_job . '  -  ' . $car_owner->job_place }}</td>
                                <td colspan="" style="border:  2px solid;">دنده او کار ځای</td>
                            </tr>
                            <tr>
                                <td colspan="22" style="border: 2px solid;"></td>
                            </tr>
                            <tr>
                                <td colspan="10" style="border: 2px solid;">{{ $car_owner->owner_description }}</td>
                                <td colspan="2" style="border: 2px solid;">توضیحات</td>
                            </tr>

                            <tr>
                                <td colspan="22"></td>
                            </tr>
                            <tr>
                                <td colspan="22" style="border: 2px solid;"><span id="mode1">د مالک عکس
                                        اپلوډ</span></td>
                            </tr>
                            <tr>
                                <td colspan="2" style="border:  2px solid;"></td>
                                <td colspan="" style="border: 2px solid;">توضیحات</td>
                                <td colspan="2" style="border:  2px solid;"></td>

                                <td colspan="3" style="border:  2px solid;">
                                    <img src="{{ asset('upload/owner/image/' . $car_owner->image) }}"
                                        class="img img-responsive" height="80" width="80" alt="">
                                </td>
                                <td colspan="" style="border:  2px solid;">عکس</td>
                            </tr>
                            <tr>
                                <td colspan="22"><span></span></td>
                            </tr>
                            <tr>
                                <td colspan="22" style="border: 2px solid;"><span id="mode1">د نقلیه وسایط
                                        مشخصات</span></td>
                            </tr>
                            <tr>
                                <td colspan="2" style="border:  2px solid;">
                                    {{ $car_owner->from_add . '-څخه- ' . $car_owner->to_add }}</td>
                                <td colspan="" style="border: 2px solid;">د تکسي لین مسیر</td>
                                <td colspan="2" style="border:  2px solid;">{{ $car_owner->create_date }}</td>
                                <td colspan="" style="border: 2px solid;">د تولید کال</td>
                                <td colspan="2" style="border:  2px solid;">{{ $car_owner->company_name }}</td>
                                <td colspan="" style="border: 2px solid;">جوړونکی شرکت</td>
                                <td colspan="2" style="border:  2px solid;">{{ $car_owner->plate_no }}</td>
                                <td colspan="" style="border:  2px solid;">پلیټ نمبر</td>
                            </tr>
                            <tr>
                                <td colspan="22" style="border: 2px solid;"></td>
                            </tr>

                            <tr>
                                <td colspan="2" style="border:  2px solid;">{{ $car_owner->car_color }}</td>
                                <td colspan="" style="border: 2px solid;">د واسطي رنګ</td>
                                <td colspan="2" style="border:  2px solid;">{{ $car_owner->oil_type }}</td>
                                <td colspan="" style="border: 2px solid;">دسون موادا (تیلو )ډول</td>
                                <td colspan="2" style="border:  2px solid;">{{ $car_owner->Engine_no }}</td>
                                <td colspan="" style="border: 2px solid;">د انجن شمیره</td>
                                <td colspan="2" style="border:  2px solid;">{{ $car_owner->shase_no }}</td>
                                <td colspan="" style="border:  2px solid;">شاسي شمیره</td>
                            </tr>
                            <tr>
                                <td colspan="22" style="border: 2px solid;"></td>
                            </tr>

                            <tr>
                                <td colspan="2" style="border:  2px solid;">{{ $car_owner->saler_info }}</td>
                                <td colspan="" style="border: 2px solid;">د خرڅونکي شهرت</td>
                                <td colspan="2" style="border:  2px solid;">{{ $car_owner->sale_date }}</td>
                                <td colspan="" style="border: 2px solid;">د پیرلو نېټه</td>
                                <td colspan="2" style="border:  2px solid;">{{ $car_owner->create_county }}</td>
                                <td colspan="" style="border: 2px solid;">تولید کوونکی هیواد</td>

                            </tr>

                            <tr>
                                <td colspan="22"></td>
                            </tr>
                            <tr>
                                <td colspan="6" style="border: 2px solid;">{{ $car_owner->car_discription }}</td>
                                <td colspan="" style="border: 2px solid;">ملاحظات</td>
                                <td colspan="4" style="border: 2px solid;">
                                    {{ $car_owner->change_address . '-څخه- ' . $car_owner->change_to_address }}</td>
                                <td colspan="" style="border: 2px solid;">دمسیر تغیر د ریکشي د مالک په غوښتنه</td>
                            </tr>
                        @endforeach
                    </table>
                </div>
                <button type="button" class="btn btn-md btn-primary" id="print">چاپ کول</button>
                <a href="{{ route('car.index') }}" class="btn btn-sm btn-danger">واپس</a>

            </div>
            <div class=" col-lg-1 col-md-12 col-sm-12">

            </div>
        </div>


    </div>



    <!-- jQuery -->
    <script src="{{ asset('plugins/jquery/jquery.min.js') }}"></script>
    <!-- Bootstrap 4 -->
    <script src="{{ asset('plugins/bootstrap/js/bootstrap.bundle.min.js') }}"></script>
    <!-- iCheck -->
    <script src="{{ asset('plugins/iCheck/icheck.min.js') }}"></script>
    <script src="{{ asset('plugins/toastr/toastr.min.js') }}"></script>
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
