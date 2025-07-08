@extends('layouts.app')
@section('title','موټر ثبت صفحه')
@section('content')
<br>


<!-- Main content -->
<section class="content" style="font-family: Bahij Zar;">
    <div class="container-fluid">

        <div class="card" style="border-radius: 0px;;">
            <div class="row" style="margin-top:20px;">

                <div class="col-lg-6" style="text-align: right;">
                    <h5 style="font-family: Bahij Titra; margin-right: 30px;">شرکت ترانســـــــپورټي ریکـــــشه راني بـابـا </h5>
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
            <div class="card card-header" style="background-color: rgb(215, 143, 143); border-radius:0px;">
                <h3 style="text-align: center; margin:0%;"> موټر ثبتول </h3>
            </div>
            <div class="card-body" style="text-align:right;">


                <form action="{{route('car.store')}}" method="post" dir="rtl">
                    @csrf
                    <div class="row">
                    <div class="form-group form-group-sm col-md-6 col-sm-6 col-xs-12">
                        <div class="form-group form-group-sm">
                            <label for="owner_code">د مالک کوډ<span style="color: red"> * </span></label>
                            <input type="text" class="form-control text-right" id="owner_code" onkeypress="return isNumber()" name="owner_code" required="required" pattern="[0-9]*[۰-۹]*" title="یوازې نمبر داخل کړئ" />
                        </div>
                        <div class="form-group form-group-sm">
                            <label for="owner_info">د مالک پیژندنه</label>
                            <input type="text" class="form-control text-right" readonly="readonly" id="owner_info" name="owner_info" />

                        </div>
                        <div class="form-group form-group-sm">
                            <label for="plate_no"><span style="color: red"> * </span>پلیت نمبر</label>
                            <input type="text" class="form-control text-right" id="plate_no" name="plate_no" pattern="[0-9]*" title="یوازې نمبر داخل کړئ" required="required" />
                            <div style="color:red"> {{$errors->first('plate_no')}}</div>
                        </div>
                        <div class="form-group form-group-sm">
                            <label for="company_name">جوړیدونکی شرکت <span style="color: red"> * </span></label>
                            <select class="form-control text-right" id="company_name" name="company_name" required="required">
                                <option value="اشترنګي آهو">اشترنګي آهو</option>
                                <option value="اشترنګی منتاژ "> اشترنګی منتاژ </option>
                                <option value="Piaggio">Piaggio</option>
                                <option value="TVS">TVS</option>
                                <option value="Bajaj">Bajaj</option>
                            </select>
                            <div style="color:red"> {{$errors->first('company_name')}}</div>
                        </div>
                        <div class="form-group form-group-sm">
                            <label for="created_date">تولید کال<span style="color: red"> * </span></label>
                            <input type="date" class="form-control text-right" id="created_date" name="created_date" required="required" />
                        </div>
                        <div class="form-group form-group-sm">
                            <label for="gh">مسیر<span style="color: red"> * </span></label>
                            <select class="form-control" name="direction_id" id="direction_id">
                                @foreach ($get_directions as $direction)
                                <option value="{{$direction->id}}">{{$direction->from_add .'   څخه     '. $direction->to_add}} </option>
                                @endforeach
                            </select>
                        </div>



                        <div class="form-group form-group-sm">
                            <label for="description">توضیحات</label>
                            <textarea class="form-control text-right" required rows="4" id="description" name="description">
                            </textarea>
                        </div>


                    </div>
                    <div class="form-group form-group-sm col-md-6 col-sm-6 col-xs-12">
                        <div class="form-group form-group-sm">
                            <label for="shase_no">شاسي نمبر<span style="color: red"> * </span></label>
                            <input type="text" class="form-control text-right" id="shase_no" name="shase_no" onkeypress="return OnNumberAlphabit();" title="یوازې انګلېسي  الفبا توري  او نمبر داخل کړئ" required="required" />
                            <div style="color:red"> {{$errors->first('shase_no')}}</div>
                        </div>


                        <div class="form-group form-group-sm">
                            <label for="Engine_no">انجن نمبر<span style="color: red"> * </span></label>
                            <input type="text" class="form-control text-right" id="Engine_no" name="Engine_no" onkeypress="return OnNumberAlphabit();" required="required" />
                            <div style="color:red"> {{$errors->first('Engine_no')}}</div>
                        </div>
                        <div class="form-group form-group-sm">
                            <label for="oil_type">د سون موادو ډول<span style="color: red"> * </span></label>
                            <select class="form-control text-right" id="oil_type" name="oil_type" required="required">
                                <option value="پټرول ">پټرول </option>
                                <option value="ډیزل ">ډیزل </option>
                                <option value="هایبرد">هایبرد</option>
                            </select>
                        </div>
                        <div class="form-group form-group-sm">
                            <label for="car_color">رنګ<span style="color: red"> * </span></label>
                            <select class="form-control text-right" id="car_color" name="car_color" required="required">
                                <option value="زیړ ">زیړ </option>
                                <option value="تور ">تور </option>
                                <option value="سور">سور</option>
                                <option value="سپین">سپین</option>
                                <option value="نیلي">نیلي</option>
                            </select>
                        </div>

                        <div class="form-group form-group-sm">
                            <label for="created_country">جوړونکی هېواد<span style="color: red"> * </span></label>
                            <select class="form-control text-right" id="created_country" name="created_country" required="required">
                                <option value="افغانستان">افغانستان</option>
                                <option value="هندوستان ">هندوستان </option>

                            </select>
                        </div>


                        <div class="form-group form-group-sm">
                            <label for="sale_date">د پیرولو نیټه<span style="color: red"> * </span></label>
                            <input type="date" class="form-control text-right" id="sale_date" name="sale_date" required="required" />
                        </div>
                        <div class="form-group form-group-sm">
                            <label for="saler_info">دپلورونکي معلومات</label>
                            <input type="text" class="form-control text-right" id="saler_info" name="saler_info" required="required" />
                        </div>
                        <div class="form-group form-group-sm">
                            <label for="change_add">د مسیر تغیر<span style="color: red"> * </span></label>
                            <select class="form-control" name="change_add" id="change_add">
                                @foreach ($get_directions as $direction)
                                <option value="{{$direction->id}}">{{$direction->from_add .'   څخه     '. $direction->to_add}} </option>
                                @endforeach
                            </select>
                        </div>


                    </div>
                    <div class="form-group form-group-sm col-md-6 col-sm-6 col-xs-12">


                        <br />
                        <input type="submit" class="btn btn-primary btn-md" value="ثبت کول" name="submit" />
                        <input type="reset" class="btn btn-danger btn-md" value="پورتنی معلومات لری کول" />
                    </div>



                    <div class="clearfix"></div>

                    <div class="col-lg-12 col-xs-12">
                        <hr />
                        <h4 class="text-right" style="color: red;"></h4>
                    </div>
                </form>


            </div>
            <div class="col-lg-12 col-md-12 col-sm-12">
                <hr style="border-bottom: 2px gray solid;" />
                <h3 class="text-center">د ټولو موټرو لېست</h3>
                <hr>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 table-responsive">
                <style>
                    #example tr th,
                    #example tr td {
                        text-align: center;
                    }
                </style>
                <table id="example" class="table table-striped table-bordered text-right" width="100%" cellspacing="0" dir="ltr">
                    <thead class="bg-gray">
                        <tr>
                            <th rowspan="2" class="text-center">عملیه</th>
                            {{-- <th  rowspan="2" class="text-center">تغیر راوستل</th> --}}
                            <th rowspan="2" class="text-center"> اسنادو اپلوډ</th>
                            <th rowspan="2"> دثبت کارمند</th>
                            <th rowspan="2"> نوی مسیر</th>
                            <th rowspan="2"> پخوانی مسیر </th>
                            <th rowspan="2">رنګ</th>
                            <th rowspan="2">د پلار نوم</th>
                            <th rowspan="2">د مالک نوم</th>
                            <th rowspan="2">انجن نمبر</th>
                            <th rowspan="2">شاسي نمبر</th>
                            <th rowspan="2">پلیټ نمبر</th>
                            <th rowspan="2">ID</th>
                            <th rowspan="2">شماره</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($get_cars as $car_recored)

                        <tr>
                            <td class="d-flex">
                                <a href="{{route('car.show',$car_recored->id)}}" class="btn btn-md btn-success btn-responsive">چاپ</i></a>
                           &nbsp; <a href="{{route('car.edit',$car_recored->id)}}" class="btn btn-md btn-danger">تغیرول</a>
                        </td>

                            <td><a href="{{url('document/index',$car_recored->id)}}" class="btn btn-md btn-info">اپلوډ</a></td>
                            <td>{{$car_recored->user_name}}</td>
                            <td>{{$car_recored->changed_address}}</td>
                            <td>{{$car_recored->current_address}}</td>
                            <td>{{$car_recored->car_color}}</td>
                            <td>{{$car_recored->father_name}}</td>
                            <td>{{$car_recored->name}}</td>
                            <td>{{$car_recored->Engine_no}}</td>
                            <td>{{$car_recored->shase_no}}</td>
                            <td>{{$car_recored->plate_no}}</td>
                            <td>{{$car_recored->owner_code}}</td>
                            <td>{{$loop->iteration}}</td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
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
