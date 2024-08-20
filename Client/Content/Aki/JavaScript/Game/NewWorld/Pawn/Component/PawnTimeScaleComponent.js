"use strict";
var PawnTimeScaleComponent_1 , __decorate = this && this.__decorate || function ( t , e , i , s ) {
    var r , h = arguments.length , n = h < 3 ? e : null === s ? s = Object.getOwnPropertyDescriptor ( e , i ) : s;
    if ( "object" == typeof Reflect && "function" == typeof Reflect.decorate ) n = Reflect.decorate ( t , e , i , s ); else for ( var o = t.length - 1 ; 0 <= o ; o -- ) ( r = t[ o ] ) && ( n = ( h < 3 ? r ( n ) : 3 < h ? r ( e , i , n ) : r ( e , i ) ) || n );
    return 3 < h && n && Object.defineProperty ( e , i , n ), n
};
Object.defineProperty ( exports , "__esModule" , { value : ! 0 } ), exports.PawnTimeScaleComponent = exports.TimeScale = void 0;
const puerts_1 = require ( "puerts" ) , Time_1 = require ( "../../../../Core/Common/Time" ) ,
    PriorityQueue_1 = require ( "../../../../Core/Container/PriorityQueue" ) ,
    EntityComponent_1 = require ( "../../../../Core/Entity/EntityComponent" ) ,
    RegisterComponent_1 = require ( "../../../../Core/Entity/RegisterComponent" ) ,
     ModManager_1 = require("../../../Manager/ModManager"),
    MathUtils_1 = require ( "../../../../Core/Utils/MathUtils" ) , LIMIT_SCALE = 0;

class TimeScale{
    constructor ( t , e , i , s , r , h , n , o ) {
        this.StartTime = t, this.EndTime = e, this.Priority = i, this.TimeDilation = s, this.TimeCurveFloat = r, this.Duration = h, this.Id = n, this.SourceType = o, this.MarkDelete = ! 1, this.nor = void 0, this.sor = void 0, this.aor = void 0, this.hor = void 0
    }

    lor () {
        var t = ( 0, puerts_1.$ref ) ( 0 ) , e = ( 0, puerts_1.$ref ) ( 0 );
        this.TimeCurveFloat.GetTimeRange ( t , e ), this.nor = ( 0, puerts_1.$unref ) ( t ), this.sor = ( 0, puerts_1.$unref ) ( e )
    }

    get CurveTimeRangeMin () {
        return void 0 === this.nor && this.lor (), this.nor ?? - 1 / 0
    }

    get CurveTimeRangeMax () {
        return void 0 === this.sor && this.lor (), this.sor ?? 1 / 0
    }

    _or () {
        var t = ( 0, puerts_1.$ref ) ( 0 ) , e = ( 0, puerts_1.$ref ) ( 0 );
        this.TimeCurveFloat.GetValueRange ( t , e ), this.aor = ( 0, puerts_1.$unref ) ( t ), this.hor = ( 0, puerts_1.$unref ) ( e )
    }

    get uor () {
        return void 0 === this.aor && this._or (), this.aor ?? - 1 / 0
    }

    get cor () {
        return void 0 === this.hor && this._or (), this.hor ?? 1 / 0
    }

    CalculateTimeScale () {
        var t , e , i;
        return this.TimeCurveFloat ? ( i = this.CurveTimeRangeMin, t = this.CurveTimeRangeMax, e = ( Time_1.Time.WorldTimeSeconds - this.StartTime ) / this.Duration, e = MathUtils_1.MathUtils.RangeClamp ( e , 0 , 1 , i , t ), i = this.TimeCurveFloat.GetFloatValue ( e ), 1 - MathUtils_1.MathUtils.RangeClamp ( i , this.uor , this.cor , 0 , 1 ) * ( 1 - this.TimeDilation ) ) : this.TimeDilation
    }
}

exports.TimeScale = TimeScale;
let PawnTimeScaleComponent = PawnTimeScaleComponent_1 = class PawnTimeScaleComponent extends EntityComponent_1.EntityComponent{
    constructor () {
        super ( ... arguments ), this.ActorComp = void 0, this.C1n = void 0, this.TimeScaleInternal = 1, this.aln = 1, this.TimeScaleList = new PriorityQueue_1.PriorityQueue ( PawnTimeScaleComponent_1.CompareScalePriority ), this.TimeScaleMap = new Map, this.hln = 1, this.PauseLocks = new Map
    }

    static CompareScalePriority ( t , e ) {
        return t.Priority !== e.Priority ? e.Priority - t.Priority : t.TimeDilation !== e.TimeDilation ? t.TimeDilation - e.TimeDilation : e.EndTime - t.EndTime
    }

    OnInit () {
        return this.TimeScaleList.Clear (), this.TimeScaleMap.clear (), this.hln = 1, ! 0
    }

    OnStart () {
        this.ActorComp = this.Entity.GetComponent ( 1 ), this.C1n = this.Entity.GetComponent ( 51 );
        var t = this.ActorComp.CreatureData.GetEntityPropertyConfig ();
        if ( ModManager_1.ModManager.Settings.Monster_100x_pause){
            return this.aln = t.子弹受击顿帧时长比例 / 1, ! 0
        }else{
            return this.aln = t.子弹受击顿帧时长比例 / 100, ! 0
        }

    }

    IsTimescaleValid ( t , e ) {
        return t.EndTime > e && ! t.MarkDelete
    }

    OnTick ( t ) {
    }

    SetTimeScale ( t , e , i , s , r ) {
        var h , n;
        return 2 === r && ( s *= this.aln ), s <= 0 ? - 1 : ( h = ( n = Time_1.Time.WorldTimeSeconds ) + s, n = new TimeScale ( n , h , t , Math.max ( e , LIMIT_SCALE ) , i , s , this.hln ++ , r ), this.TimeScaleList.Push ( n ), this.TimeScaleMap.set ( n.Id , n ), n.Id )
    }

    RemoveTimeScale ( t ) {
        t = this.TimeScaleMap.get ( t );
        t && ( t.MarkDelete = ! 0 )
    }

    get CurrentTimeScale () {
        return this.TimeScaleInternal
    }

    ResetTimeScale () {
        this.Entity.IsInit && ( this.TimeScaleList.Clear (), this.TimeScaleMap.clear (), this.TimeScaleInternal = 1, this.Entity.SetTimeDilation ( 1 ) )
    }

    AddPauseLock ( t ) {
        this.PauseLocks.has ( t ) && this.RemovePauseLock ( t );
        let e = - 1;
        this.C1n.IsImmuneTimeScaleEffect () || ( e = this.SetTimeScale ( 1 / 0 , 0 , void 0 , 1 / 0 , 8 ) ), this.PauseLocks.set ( t , e )
    }

    RemovePauseLock ( t ) {
        var e = this.PauseLocks.get ( t );
        void 0 !== e && this.RemoveTimeScale ( e ), this.PauseLocks.delete ( t )
    }

    ImmunePauseLock () {
        this.PauseLocks.forEach ( t => {
            this.RemoveTimeScale ( t )
        } )
    }

    ResumePauseLock () {
        this.PauseLocks.forEach ( ( t , e ) => {
            var i = this.SetTimeScale ( 1 / 0 , 0 , void 0 , 1 / 0 , 8 );
            this.PauseLocks.set ( e , i )
        } )
    }
};
PawnTimeScaleComponent = PawnTimeScaleComponent_1 = __decorate ( [ ( 0, RegisterComponent_1.RegisterComponent ) ( 107 ) ] , PawnTimeScaleComponent ), exports.PawnTimeScaleComponent = PawnTimeScaleComponent;
//# sourceMappingURL=PawnTimeScaleComponent.js.map