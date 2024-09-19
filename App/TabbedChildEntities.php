<?php


namespace App\Plugins\TabbedChildEntities\App;

use Illuminate\Database\Eloquent\Model;

class TabbedChildEntities extends Model
{    
    protected $table = 'tabbed_child_entities'; // Specify the table name if it's different from the model name

    protected $fillable = [
        'entity_type_id'
    ];   

    public static function updateData(int $entityId, bool $useTabbedChildren){
        if($useTabbedChildren) {
            TabbedChildEntities::firstOrCreate([
                'entity_type_id' => $entityId
            ]);
        }else{            
            TabbedChildEntities::where('entity_type_id', $entityId)->delete();
        }
    }

    public static function activeIds(array $ids) : array {
        return TabbedChildEntities::whereIn('entity_type_id', $ids)->pluck('entity_type_id')->all();
    }
    
}

