@extends('layouts.app')
@section('title',' ولسوالي معلومات تغیرول ')
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
            <div class="card card-header" style="background-color: gray;  color:white; border-radius:0px;">
                <h5 style="text-align: center;"> ولسوالي معلومات تغیرول </h5>
            </div>
            <div class="card-body" style="text-align:right;">

                <form method="post" action="{{route('district.update',$district)}}" dir="rtl" style="text-align:right;">
                    @csrf
                    @method('PUT')
                    <div class="row">
                        <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12 pull-right">


                            <div class="form-group form-group-sm">
                                <label for="pro2">ولایت</label>
                                <select class="form-control" id="province_id" required="required" name="province_id">
                                    <option value="{{$district->province_id}}">{{$district->province->name}}</option>
                                    @foreach ($provinces as $province)
                                    <option value="{{$province->id}}">{{$province->name}}</option>
                                    @endforeach
                                </select>
                            </div>

                        </div>

                        <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12 pull-right">
                            <div class="form-group-sm ">
                                <label for="name">ولسوالي </label>
                                <input type="text" value="{{$district->name}}"  required="required" placeholder="نوی ولسوالي اضافه کړئ" class="form-control" id="name" name="name" pattern="[A-Za-z\s]*[آاأبپتټثجحخچڅځدذډرزؤوړږسښشصضطظعغفقکګلمنڼږهءیيېئ۰ۍ\s]*" title="یوازې الفبا توري داخل کړئ" />
                            </div>
                        </div>


                        <div class="col-lg-2 col-md-3 col-sm-12 col-xs-12 pull-right" style="margin-top: 30px;">
                            <button type="submit" class="btn btn-primary btn-md " name="submit">ثبت کول</button>
                            <a href="{{route('district.index')}}" class="btn btn-danger btn-md ">واپس تلل</a>
                            <!-- <input type="submit" class="btn btn-default btn-md" value="پورتني معلومات لیري کول" name="submit" /> -->
                        </div>

                        <div class="clearfix"></div>
                    </div>
                </form>


            </div>


        </div>
    </div>
</section>


@endsection


@section('pageJs')

<script>

</script>

@endsection
