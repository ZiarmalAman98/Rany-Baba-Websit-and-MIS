@extends('layouts.app')
@section('title', 'د موټر تغیر پاڼه')
@section('content')
    <br>
    <!-- Main content -->
    <section class="content" style="font-family: Bahij Zar;">
        <div class="container-fluid">

            <div class="card" style="border-radius: 0px;;">
                <div class="row" style="margin-top:20px;">

                    <div class="col-lg-6" style="text-align: right;">
                        <h5 style="font-family: Bahij Titra; margin-right: 30px;">شرکت ترانســـــــپورټي ریکـــــشه راني
                            بـابـا </h5>
                    </div>
                    <div class="col-lg-6  text-left">
                        <span id="time" style="margin-left:10px;"></span>
                        <script>
                            window.setInterval(ut, 1000);

                            function ut() {
                                var d = new Date();
                                document.getElementById("time").innerHTML = d.toLocaleTimeString();
                            }
                        </script>
                    </div>

                </div>
                <div class="card card-header" style="background-color: lightgray; border-radius:0px;">
                    <h3 style="text-align: center; margin:0%;"> د موټر معلوماتو د تغیر پاڼه </h3>
                </div>
                <div class="card-body" style="text-align:right;">


                    <form action="{{ route('car.update', $edit_car) }}" method="post" dir="rtl">
                        @csrf
                        @method('PUT')
                        <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 pull-right">
                            <div class="form-group form-group-sm">
                                <label for="owner_code">د مالک کوډ<span style="color: red"> * </span></label>
                                <input type="text" class="form-control text-right" readonly
                                    value="{{ $edit_car->owner_id }}" id="owner_code" name="owner_code" required="required"
                                    pattern="[0-9]*[۰-۹]*" title="یوازې نمبر داخل کړئ" />
                            </div>
                            <div class="form-group form-group-sm">
                                <label for="owner_info">د مالک پیژندنه</label>
                                <input type="text" class="form-control text-right" readonly="readonly"
                                    value="{{ $owner_name->name . '-' . $owner_name->father_name }}" id="owner_info"
                                    name="owner_info" />
                            </div>
                            <div class="form-group form-group-sm">
                                <label for="plate_no"><span style="color: red"> * </span>پلیت نمبر</label>
                                <input type="text" class="form-control text-right" value="{{ $edit_car->plate_no }}"
                                    id="plate_no" name="plate_no" pattern="[0-9]*[۰-۹]*" title="یوازې نمبر داخل کړئ"
                                    required="required" />
                            </div>
                            <div class="form-group form-group-sm">
                                <label for="company_name"> جوړیدونکی شرکت * <span style="color: red"> * </span></label>
                                <select class="form-control text-right" id="company_name" name="company_name"
                                    required="required">
                                    <option {{ $edit_car->company_name == 'اشترنګي آهو' ? 'selected' : '' }}
                                        value="اشترنګي آهو">اشترنګي آهو</option>
                                    <option {{ $edit_car->company_name == 'اشترنګی منتاژ' ? 'selected' : '' }}
                                        value="اشترنګی منتاژ "> اشترنګی منتاژ </option>
                                    <option {{ $edit_car->company_name == 'Piaggio' ? 'selected' : '' }} value="Piaggio">
                                        Piaggio</option>
                                    <option {{ $edit_car->company_name == 'TVS' ? 'selected' : '' }} value="TVS">TVS
                                    </option>
                                    <option {{ $edit_car->company_name == 'Bajaj' ? 'selected' : '' }} value="Bajaj">Bajaj
                                    </option>
                                </select>
                            </div>
                            <div class="form-group form-group-sm">
                                <label for="created_date">تولید کال<span style="color: red"> * </span></label>
                                <input type="date" class="form-control text-right" id="created_date"
                                    value="{{ $edit_car->create_date }}" name="created_date" required="required" />
                            </div>
                            <div class="form-group form-group-sm">
                                <label for="gh">مسیر<span style="color: red"> * </span></label>
                                <select class="form-control" name="direction_id" id="direction_id">
                                    @foreach ($get_directions as $direction)
                                        <option {{ $edit_car->direction_id == $direction->id ? 'selected' : '' }}
                                            value="{{ $direction->id }}">
                                            {{ $direction->from_add . '   څخه     ' . $direction->to_add }} </option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 pull-right">
                            <div class="form-group form-group-sm">
                                <label for="shase_no">شاسي نمبر<span style="color: red"> * </span></label>
                                <input type="text" class="form-control text-right" id="shase_no" name="shase_no"
                                    onkeypress="return OnNumberAlphabit();" value="{{ $edit_car->shase_no }}"
                                    required="required" />
                            </div>
                            <div class="form-group form-group-sm">
                                <label for="Engine_no">انجن نمبر<span style="color: red"> * </span></label>
                                <input type="text" class="form-control text-right" id="Engine_no" name="Engine_no"
                                    value="{{ $edit_car->Engine_no }}" required="required" />
                            </div>
                            <div class="form-group form-group-sm">
                                <label for="oil_type">د سون موادو ډول<span style="color: red"> * </span></label>
                                <select class="form-control text-right" id="oil_type" name="oil_type"
                                    value="{{ $edit_car->oil_type }}" required="required">
                                    <option {{ $edit_car->oil_type == 'پټرول' ? 'selected' : '' }} value="پټرول ">پټرول
                                    </option>
                                    <option {{ $edit_car->oil_type == 'ډیزل' ? 'selected' : '' }} value="ډیزل ">ډیزل
                                    </option>
                                    <option {{ $edit_car->oil_type == 'هایبرد' ? 'selected' : '' }} value="هایبرد">هایبرد
                                    </option>
                                </select>

                            </div>

                            <div class="form-group form-group-sm">
                                <label for="car_color">رنګ<span style="color: red"> * </span></label>
                                <select class="form-control text-right" id="car_color" name="car_color"
                                    value="{{ $edit_car->car_color }}" required="required">
                                    <option {{ $edit_car->car_color == 'زیړ' ? 'selected' : '' }} value="زیړ ">زیړ
                                    </option>
                                    <option {{ $edit_car->car_color == 'تور' ? 'selected' : '' }} value="تور ">تور
                                    </option>
                                    <option {{ $edit_car->car_color == 'سور' ? 'selected' : '' }} value="سور">سور
                                    </option>
                                    <option {{ $edit_car->car_color == 'سپین' ? 'selected' : '' }} value="سپین">سپین
                                    </option>
                                    <option {{ $edit_car->car_color == 'نیلي' ? 'selected' : '' }} value="نیلي">نیلي
                                    </option>
                                </select>

                            </div>

                            <div class="form-group form-group-sm">
                                <label for="created_country"> جوړونکی هېواد<span style="color: red"> * </span></label>
                                <select class="form-control text-righ" id="created_country" name="created_country"
                                    required="required">
                                    <option {{ $edit_car->create_county == 'افغانستان' ? 'selected' : '' }}
                                        value="افغانستان">افغانستان</option>
                                    <option {{ $edit_car->create_county == 'هندوستان' ? 'selected' : '' }}
                                        value="هندوستان ">هندوستان </option>
                                </select>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 pull-right">
                            <div class="form-group form-group-sm">
                                <label for="sale_date">د پیرولو نیټه<span style="color: red"> * </span></label>
                                <input type="date" class="form-control text-right" value="{{ $edit_car->sale_date }}"
                                    id="sale_date" name="sale_date" required="required" />
                            </div>
                            <div class="form-group form-group-sm">
                                <label for="saler_info">پلورونکي معلومات</label>
                                <input type="text" class="form-control text-right"
                                    value="{{ $edit_car->saler_info }}" id="saler_info" name="saler_info"
                                    required="required" />
                            </div>
                            <div class="form-group form-group-sm">
                                <label for="change_add">د مسیر تغیر<span style="color: red"> * </span></label>
                                <select class="form-control" name="change_add" id="change_add">
                                    @foreach ($get_directions as $direction)
                                        <option {{ $edit_car->change_add == $direction->id ? 'selected' : '' }}
                                            value="{{ $direction->id }}">
                                            {{ $direction->from_add . '   څخه     ' . $direction->to_add }} </option>
                                    @endforeach
                                </select>
                            </div>

                            <div class="form-group form-group-sm">
                                <label for="description">توضیحات</label>
                                <input type="text" value="{{ $edit_car->description }}"
                                    class="form-control text-right" id="description" name="description" />
                            </div><br />
                            <input type="submit" class="btn btn-primary btn-md" value="تغیرات راوستل" name="submit" />
                            <a href="{{ route('car.index') }}" class="btn btn-danger btn-md">واپس</a>
                        </div>
                        <div class="clearfix"></div>

                        <div class="col-lg-12 col-xs-12">
                            <hr />
                            <h4 class="text-right" style="color: red;"></h4>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </section>


@endsection


@section('pageJs')

    <script>
        function OnNumberAlphabit() {
            var ew = event.which;
            if (event == 32)
                return true;
            if (48 <= ew && ew <= 57)
                return true;
            if (65 <= ew && ew <= 90)
                return true;
            if (97 <= ew && ew <= 122)
                return true;
            return false
        }

        $("#owner_code").blur(function() {
            var owner_code = $(this).val();
            //alert(medicineId);
            $.ajax({
                url: 'ajax/fill_owner',
                type: 'GET',
                cache: false,
                async: false,
                data: {
                    'owner_code': owner_code
                },
                success: function(data) {
                    $("#owner_info").val(data);
                    // alert(data);
                },
                error: function() {
                    alert("error");
                }
            });
        });
    </script>

@endsection
